const rawStr = '__ADDRESS_BOOK_JSON_START__\\n{"status": "success", "count": 5, "address_list": [{"entry_id": "25", "registration_no": "00001", "name": "scan", "folder": "\\\\\\\\dongasv\\\\scan"}]}\\n__ADDRESS_BOOK_JSON_END__';
let jsonStr = rawStr.split('__ADDRESS_BOOK_JSON_START__')[1].split('__ADDRESS_BOOK_JSON_END__')[0].trim();
jsonStr = jsonStr.replace(/^(\n|\r|\\n|\\r)+|(\n|\r|\\n|\\r)+$/g, '').trim();
console.log('jsonStr = ', jsonStr);
try {
  const obj = JSON.parse(jsonStr);
  console.log('SUCCESS:', obj);
} catch(e) {
  console.error('ERROR:', e.message);
}
