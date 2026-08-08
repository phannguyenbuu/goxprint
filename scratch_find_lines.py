with open('app-gox/src/pages/AgentPage.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if "{activeTab === 'agents' && (" in l: print(f'Agents: {i}')
    if "{activeTab === 'cameras' && (" in l: print(f'Cameras: {i}')
    if "{/* CAMERA OPERATIONS MODAL */}" in l: print(f'Cameras Modal: {i}')
    if "{/* Modal Add Email */}" in l: print(f'Add Email Modal: {i}')
    if "  );" in l and i > 7000: print(f'End return: {i}')
