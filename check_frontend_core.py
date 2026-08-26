import codecs
with codecs.open(r'D:\Dropbox\_Documents\Goxprint\app-gox\src\pages\Agent\hooks\useAgentCoreLogic.ts', 'r', 'utf-8') as f:
    text = f.read()
    lines = text.split('\n')
    for i, line in enumerate(lines):
        if 'triggerAgentUtilityExec' in line:
            print(f'--- Line {i} ---')
            start = max(0, i-5)
            end = min(len(lines), i+5)
            for j in range(start, end):
                print(f'{j}: {lines[j].encode("ascii", "ignore").decode("ascii")}')
