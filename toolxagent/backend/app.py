import os
import uuid
import hashlib
from datetime import datetime, timezone
from pathlib import Path
from flask import Flask, request, jsonify, render_template, redirect, url_for, session, send_from_directory
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from sqlalchemy import create_engine, text, select
from sqlalchemy.orm import sessionmaker

from models import Base, User, Document, Release, Diagnostic

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "toolx-secret-key-128gb-ram")

# Setup directories
BASE_DIR = Path(__file__).resolve().parent
STORAGE_DIR = BASE_DIR / "storage"
UPLOAD_FOLDER = STORAGE_DIR / "uploads"
DOWNLOAD_FOLDER = STORAGE_DIR / "downloads"
PREVIEW_FOLDER = STORAGE_DIR / "previews"
RELEASE_FOLDER = STORAGE_DIR / "releases"

for folder in [UPLOAD_FOLDER, DOWNLOAD_FOLDER, PREVIEW_FOLDER, RELEASE_FOLDER]:
    folder.mkdir(parents=True, exist_ok=True)

app.config['UPLOAD_FOLDER'] = str(UPLOAD_FOLDER)
app.config['DOWNLOAD_FOLDER'] = str(DOWNLOAD_FOLDER)
app.config['PREVIEW_FOLDER'] = str(PREVIEW_FOLDER)
app.config['RELEASE_FOLDER'] = str(RELEASE_FOLDER)

# DB setup
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASSWORD = os.getenv("DB_PASSWORD", "myPass")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "toolx")

# Try to create the database if it doesn't exist
try:
    postgres_url = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/postgres"
    temp_engine = create_engine(postgres_url, isolation_level="AUTOCOMMIT")
    with temp_engine.connect() as conn:
        # Check if database exists
        result = conn.execute(text(f"SELECT 1 FROM pg_database WHERE datname='{DB_NAME}'"))
        if not result.scalar():
            conn.execute(text(f"CREATE DATABASE {DB_NAME}"))
            print(f"Database {DB_NAME} created successfully.")
    temp_engine.dispose()
except Exception as e:
    print(f"Error checking/creating database: {e}")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize database tables
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized.")
    # Migration: Add columns one-by-one in separate transaction blocks
    migrations = [
        "ALTER TABLE releases ADD COLUMN core_version VARCHAR(32)",
        "ALTER TABLE releases ADD COLUMN core_url VARCHAR(500)",
        "ALTER TABLE releases ADD COLUMN core_sha256 VARCHAR(64)",
        "ALTER TABLE documents ADD COLUMN profile VARCHAR(100) DEFAULT 'JapanColor2001Coated.icc'",
        "ALTER TABLE diagnostics ADD COLUMN settings_json TEXT",
        "ALTER TABLE diagnostics ADD COLUMN pending_command TEXT",
        "ALTER TABLE documents ADD COLUMN max_pixels BIGINT DEFAULT 1000000000"
    ]
    for sql in migrations:
        try:
            with engine.begin() as conn:
                conn.execute(text(sql))
        except Exception:
            pass
except Exception as e:
    print(f"Error initializing tables: {e}")

def get_db():
    db = SessionLocal()
    try:
        return db
    except Exception:
        db.close()
        raise

# Helper functions
def get_current_user():
    db = get_db()
    try:
        user = db.query(User).order_by(User.id.asc()).first()
        if not user:
            # Create a default user
            pw_hash = generate_password_hash("admin123")
            user = User(username="admin", password_hash=pw_hash)
            db.add(user)
            db.commit()
            db.refresh(user)
        # Store in session for templates that check session.username or session.user_id
        session['user_id'] = user.id
        session['username'] = user.username
        return user
    except Exception as e:
        print(f"Error in get_current_user: {e}")
        return None
    finally:
        db.close()

# Routes for static files
@app.route('/storage/downloads/<filename>')
def custom_downloads(filename):
    return send_from_directory(app.config['DOWNLOAD_FOLDER'], filename)

@app.route('/storage/previews/<filename>')
def custom_previews(filename):
    return send_from_directory(app.config['PREVIEW_FOLDER'], filename)

@app.route('/static/releases/<filename>')
def custom_releases(filename):
    return send_from_directory(app.config['RELEASE_FOLDER'], filename)

# Web UI Routes
@app.route('/')
def index():
    user = get_current_user()
    if not user:
        return redirect(url_for('login'))
    
    try:
        page = int(request.args.get('page', 1))
    except ValueError:
        page = 1
        
    try:
        per_page = int(request.args.get('per_page', 10))
    except ValueError:
        per_page = 10
        
    if page < 1:
        page = 1
    if per_page < 1:
        per_page = 10
        
    db = get_db()
    try:
        total_count = db.query(Document).filter(Document.user_id == user.id).count()
        total_pages = (total_count + per_page - 1) // per_page if total_count > 0 else 1
        
        if page > total_pages:
            page = total_pages
            
        offset = (page - 1) * per_page
        documents = db.query(Document).filter(Document.user_id == user.id)\
            .order_by(Document.created_at.desc())\
            .limit(per_page)\
            .offset(offset)\
            .all()
            
        return render_template(
            'index.html', 
            user=user, 
            documents=documents,
            page=page,
            per_page=per_page,
            total_count=total_count,
            total_pages=total_pages
        )
    finally:
        db.close()

@app.route('/delete/<doc_id>', methods=['POST'])
def delete_document(doc_id):
    user = get_current_user()
    if not user:
        return redirect(url_for('login'))
        
    db = get_db()
    try:
        doc = db.query(Document).filter(Document.id == doc_id, Document.user_id == user.id).first()
        if doc:
            for path in [doc.original_path, doc.rendered_path, doc.preview_path]:
                if path and os.path.exists(path):
                    try:
                        os.remove(path)
                    except Exception:
                        pass
            db.delete(doc)
            db.commit()
    finally:
        db.close()
    return redirect(url_for('index'))

@app.route('/clear_all', methods=['POST'])
def clear_all_documents():
    user = get_current_user()
    if not user:
        return redirect(url_for('login'))
        
    db = get_db()
    try:
        docs = db.query(Document).filter(Document.user_id == user.id).all()
        for doc in docs:
            for path in [doc.original_path, doc.rendered_path, doc.preview_path]:
                if path and os.path.exists(path):
                    try:
                        os.remove(path)
                    except Exception:
                        pass
            db.delete(doc)
        db.commit()
    finally:
        db.close()
    return redirect(url_for('index'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        if not username or not password:
            return "Username and password required", 400
            
        db = get_db()
        try:
            existing = db.query(User).filter(User.username == username).first()
            if existing:
                return "Username already exists", 400
                
            pw_hash = generate_password_hash(password)
            new_user = User(username=username, password_hash=pw_hash)
            db.add(new_user)
            db.commit()
            return redirect(url_for('login'))
        except Exception as e:
            db.rollback()
            return f"Error: {e}", 500
        finally:
            db.close()
            
    return render_template('index.html', page='register')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        db = get_db()
        try:
            user = db.query(User).filter(User.username == username).first()
            if user and check_password_hash(user.password_hash, password):
                session['user_id'] = user.id
                session['username'] = user.username
                return redirect(url_for('index'))
            return "Invalid username or password", 401
        finally:
            db.close()
            
    return render_template('index.html', page='login')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/upload', methods=['POST'])
def upload_file():
    user = get_current_user()
    if not user:
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
        
    if 'file' not in request.files:
        return jsonify({"ok": False, "error": "No file uploaded"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"ok": False, "error": "No selected file"}), 400
        
    dpi = int(request.form.get('dpi', 300))
    use_icc = request.form.get('use_icc') == 'on'
    convert_to_pdf = request.form.get('convert_to_pdf') == 'on'
    
    if use_icc:
        colorspace = request.form.get('colorspace', 'rgb').lower()
        profile = request.form.get('profile', '')
        if not profile:
            profile = "sRGB Color Space Profile.icm" if colorspace == 'rgb' else "JapanColor2001Coated.icc"
    else:
        colorspace = 'rgb'
        profile = 'None'
        
    compression = request.form.get('compression', 'lzw').lower()
    
    # Save file
    safe_name = f"{uuid.uuid4().hex}_{secure_filename(file.filename)}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], safe_name)
    file.save(file_path)
    
    db = get_db()
    try:
        doc = Document(
            user_id=user.id,
            filename=file.filename,
            dpi=dpi,
            colorspace=colorspace,
            compression=compression,
            profile=profile,
            original_path=file_path,
            convert_to_pdf=convert_to_pdf,
            status="pending"
        )
        db.add(doc)
        db.commit()
        return redirect(url_for('index'))
    except Exception as e:
        db.rollback()
        return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        db.close()

# Agent API Endpoints
@app.route('/api/agent/clear_pending', methods=['POST'])
def agent_clear_pending():
    db = get_db()
    try:
        # Mark all pending or rendering documents as failed due to Agent restart
        docs = db.query(Document).filter(Document.status.in_(["pending", "rendering"])).all()
        for doc in docs:
            doc.status = "failed"
            doc.error_message = "Tác vụ bị hủy do Agent khởi động lại."
        db.commit()
        return jsonify({"ok": True, "count": len(docs)})
    except Exception as e:
        db.rollback()
        return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/agent/poll', methods=['GET'])
def agent_poll():
    # Agent includes its max memory (in GB) in headers or params
    agent_ram_gb = float(request.args.get('ram_gb', 96.0))
    # Max pixels that the agent can handle
    # E.g. ram_gb * 0.8 * 1024**3 / 4 (for CMYK)
    safety_factor = 0.8
    bytes_per_pixel = 4
    agent_max_pixels = min(4294967295, int(agent_ram_gb * safety_factor * (1024**3) / bytes_per_pixel))
    
    db = get_db()
    try:
        # Check if there is a pending command
        diag = db.query(Diagnostic).first()
        command = None
        if diag and diag.pending_command:
            command = diag.pending_command
            diag.pending_command = None
            db.commit()
            
        # Get next pending job
        doc = db.query(Document).filter(Document.status == "pending").order_by(Document.created_at.asc()).first()
        if not doc:
            return jsonify({"job": None, "command": command})
            
        # Update job status to rendering
        doc.status = "rendering"
        db.commit()
        
        # Return job details
        return jsonify({
            "job": {
                "id": doc.id,
                "filename": doc.filename,
                "dpi": doc.dpi,
                "colorspace": doc.colorspace,
                "compression": doc.compression,
                "profile": doc.profile,
                "download_url": f"/api/agent/download/{doc.id}",
                "max_pixels": agent_max_pixels,
                "convert_to_pdf": doc.convert_to_pdf
            },
            "command": command
        })
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/agent/download/<doc_id>', methods=['GET'])
def agent_download_file(doc_id):
    db = get_db()
    try:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return "Not found", 404
        return send_from_directory(app.config['UPLOAD_FOLDER'], os.path.basename(doc.original_path))
    finally:
        db.close()

@app.route('/api/agent/upload/<doc_id>', methods=['POST'])
def agent_upload_result(doc_id):
    db = get_db()
    try:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return jsonify({"ok": False, "error": "Document not found"}), 404
            
        if 'tiff' not in request.files:
            return jsonify({"ok": False, "error": "Rendered TIFF file missing"}), 400
            
        tiff_file = request.files['tiff']
        preview_file = request.files.get('preview')
        
        # Save rendered TIFF or PDF
        rendered_name = f"{doc.id}.pdf" if doc.convert_to_pdf else f"{doc.id}.tif"
        rendered_path = os.path.join(app.config['DOWNLOAD_FOLDER'], rendered_name)
        tiff_file.save(rendered_path)
        
        # Save preview jpeg
        preview_path = None
        if preview_file:
            preview_name = f"{doc.id}.jpg"
            preview_path = os.path.join(app.config['PREVIEW_FOLDER'], preview_name)
            preview_file.save(preview_path)
            
        # Update document record
        doc.status = "completed"
        doc.rendered_path = rendered_path
        if preview_path:
            doc.preview_path = preview_path
        doc.completed_at = datetime.now(timezone.utc)
        
        db.commit()
        return jsonify({"ok": True})
    except Exception as e:
        db.rollback()
        return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/agent/status/<doc_id>', methods=['POST'])
def agent_update_status(doc_id):
    db = get_db()
    try:
        doc = db.query(Document).filter(Document.id == doc_id).first()
        if not doc:
            return jsonify({"ok": False, "error": "Document not found"}), 404
            
        data = request.get_json() or {}
        status = data.get("status", "failed")
        error_message = data.get("error_message")
        
        doc.status = status
        if error_message:
            doc.error_message = error_message
        if status in ["completed", "failed"]:
            doc.completed_at = datetime.now(timezone.utc)
            
        db.commit()
        return jsonify({"ok": True})
    except Exception as e:
        db.rollback()
        return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        db.close()

# Agent Auto-Update Release endpoints
@app.route('/api/agent/release', methods=['GET'])
def get_release_manifest():
    db = get_db()
    try:
        # Check releases table for the latest release
        latest = db.query(Release).order_by(Release.created_at.desc()).first()
        if latest:
            return jsonify({
                "version": latest.version,
                "url": latest.download_url,
                "sha256": latest.sha256,
                "core_version": latest.core_version or "1.0.0",
                "core_url": latest.core_url or "/static/releases/toolx_core.zip",
                "core_sha256": latest.core_sha256 or "",
                "update_available": True
            })
            
        # If database table is empty, check static releases folder for agent_release.json
        manifest_path = RELEASE_FOLDER / "agent_release.json"
        if manifest_path.exists():
            import json
            try:
                manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
                return jsonify(manifest)
            except Exception as e:
                print(f"Error reading release manifest: {e}")
                
        return jsonify({
            "version": "1.5.2",
            "url": "/static/releases/toolxagent_v1.5.2.exe",
            "sha256": "",
            "core_version": "1.5.2",
            "core_url": "/static/releases/toolx_core.zip",
            "core_sha256": "",
            "update_available": False
        })
    finally:
        db.close()

@app.route('/api/agent/diagnose', methods=['POST'])
def agent_diagnose():
    data = request.get_json() or {}
    db = get_db()
    try:
        user = db.query(User).order_by(User.id.asc()).first()
        user_id = user.id if user else 1
        
        hostname = data.get("hostname", "Unknown")
        agent_version = data.get("agent_version", "1.0.0")
        core_version = data.get("core_version", "1.0.0")
        cpu_usage = float(data.get("cpu_usage", 0.0))
        ram_used_gb = float(data.get("ram_used_gb", 0.0))
        ram_total_gb = float(data.get("ram_total_gb", 0.0))
        stout_logs = data.get("stout_logs", "")
        sterror_logs = data.get("sterror_logs", "")
        settings_json = data.get("settings_json", "")
        system_info = data.get("system_info", {})
        
        # Check if diagnostic record exists for this user
        diag = db.query(Diagnostic).filter(Diagnostic.user_id == user_id).first()
        if not diag:
            diag = Diagnostic(user_id=user_id)
            db.add(diag)
            
        diag.hostname = hostname
        diag.agent_version = agent_version
        diag.core_version = core_version
        diag.cpu_usage = cpu_usage
        diag.ram_used_gb = ram_used_gb
        diag.ram_total_gb = ram_total_gb
        diag.is_online = True
        diag.last_heartbeat_at = datetime.now(timezone.utc)
        diag.stout_logs = stout_logs
        diag.sterror_logs = sterror_logs
        diag.settings_json = settings_json
        diag.system_info = system_info
        
        db.commit()
        return jsonify({"ok": True})
    except Exception as e:
        db.rollback()
        return jsonify({"ok": False, "error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/agent/logs', methods=['GET'])
def get_agent_logs():
    user = get_current_user()
    if not user:
        return jsonify({"ok": False, "error": "Unauthorized"}), 401
        
    db = get_db()
    try:
        diag = db.query(Diagnostic).filter(Diagnostic.user_id == user.id).first()
        if not diag:
            return jsonify({
                "ok": True,
                "settings_json": "{}",
                "stout_logs": "Chưa có log từ Agent.",
                "sterror_logs": "Chưa có log lỗi từ Agent."
            })
        return jsonify({
            "ok": True,
            "settings_json": diag.settings_json or "{}",
            "stout_logs": diag.stout_logs or "Chưa có log từ Agent.",
            "sterror_logs": diag.sterror_logs or "Chưa có log lỗi từ Agent."
        })
    finally:
        db.close()

@app.route('/diagnose', methods=['GET'])
def view_diagnose():
    user = get_current_user()
    if not user:
        return redirect(url_for('login'))
        
    db = get_db()
    try:
        diag = db.query(Diagnostic).filter(Diagnostic.user_id == user.id).first()
        # If no diagnostic record, also check user 1
        if not diag and user.id != 1:
            diag = db.query(Diagnostic).filter(Diagnostic.user_id == 1).first()
            
        is_online = False
        if diag:
            # Check if last heartbeat was within the last 3 minutes
            delta = datetime.now(timezone.utc) - diag.last_heartbeat_at.replace(tzinfo=timezone.utc)
            is_online = delta.total_seconds() < 180
            diag.is_online = is_online
            db.commit()
            
        return render_template('diagnose.html', diag=diag, is_online=is_online)
    finally:
        db.close()

@app.route('/downloads', methods=['GET'])
def view_downloads():
    user = get_current_user()
    if not user:
        return redirect(url_for('login'))
        
    db = get_db()
    try:
        diags = db.query(Diagnostic).all()
        now = datetime.now(timezone.utc)
        for d in diags:
            delta = now - d.last_heartbeat_at.replace(tzinfo=timezone.utc)
            d.is_online = delta.total_seconds() < 180
        db.commit()
        return render_template('downloads.html', diags=diags)
    finally:
        db.close()
@app.route('/api/agent/pagefile/maximize', methods=['POST'])
def maximize_pagefile_trigger():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    db = get_db()
    try:
        diag = db.query(Diagnostic).filter(Diagnostic.user_id == user.id).first()
        if not diag and user.id != 1:
            diag = db.query(Diagnostic).filter(Diagnostic.user_id == 1).first()
            
        if not diag:
            return jsonify({"error": "No diagnostic record found"}), 404
            
        diag.pending_command = "maximize_pagefile"
        db.commit()
        return jsonify({"ok": True})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

@app.route('/api/agent/restart', methods=['POST'])
def restart_agent_trigger():
    user = get_current_user()
    if not user:
        return jsonify({"error": "Unauthorized"}), 401
    db = get_db()
    try:
        diag = db.query(Diagnostic).filter(Diagnostic.user_id == user.id).first()
        if not diag and user.id != 1:
            diag = db.query(Diagnostic).filter(Diagnostic.user_id == 1).first()
            
        if not diag:
            return jsonify({"error": "No diagnostic record found"}), 404
            
        diag.pending_command = "restart_agent"
        db.commit()
        return jsonify({"ok": True})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8006, debug=True)
