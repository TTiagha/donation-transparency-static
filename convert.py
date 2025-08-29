
import re

def convert_md_to_html(md_content):
    html = []
    in_table = False
    table_header = True

    lines = md_content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        # Headers
        if line.startswith('# '):
            html.append(f'<h1 class="text-4xl md:text-6xl font-extrabold mb-4"><span class="bg-gradient-to-r from-emerald-500 to-cyan-500 text-transparent bg-clip-text">{line[2:]}</span></h1>')
        elif line.startswith('## '):
            html.append(f'<h2 class="text-3xl font-bold mb-6 gradient-text">{line[3:]}</h2>')
        elif line.startswith('### '):
            html.append(f'<h3 class="text-2xl font-bold mb-4 text-emerald-600">{line[4:]}</h3>')
        # Bold and Italics
        elif '**' in line or '*' in line:
            line = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', line)
            line = re.sub(r'\*(.*?)\*', r'<em>\1</em>', line)
            html.append(f'<p class="mb-4">{line}</p>')
        # Links
        elif '[' in line and ']' in line:
            line = re.sub(r'\[(.*?)\]\((.*?)\)', r'<a href="\2" class="text-emerald-600 hover:underline">\1</a>', line)
            html.append(f'<p class="mb-4">{line}</p>')
        # Lists
        elif line.startswith('* '):
            html.append('<ul class="list-disc list-inside space-y-2 mb-4">')
            while i < len(lines) and lines[i].startswith('* '):
                html.append(f'<li>{lines[i][2:]}</li>')
                i += 1
            html.append('</ul>')
            i -= 1 # Decrement to account for the outer loop's increment
        # Tables
        elif line.startswith('| '):
            if not in_table:
                html.append('<div class="overflow-x-auto mb-4"><table class="min-w-full bg-white shadow-md rounded-lg"><thead>')
                in_table = True
                table_header = True
            
            parts = [p.strip() for p in line.split('|')[1:-1]]
            if table_header:
                if all(p.startswith(':---') for p in parts):
                    i += 1
                    continue # Skip the separator line
                html.append('<tr>')
                for part in parts:
                    html.append(f'<th class="p-4 text-left font-bold">{part}</th>')
                html.append('</tr></thead><tbody>')
                table_header = False
            else:
                html.append('<tr>')
                for part in parts:
                    html.append(f'<td class="p-4 border-t">{part}</td>')
                html.append('</tr>')
        elif in_table:
            html.append('</tbody></table></div>')
            in_table = False
        # Default
        else:
            if line.strip():
                html.append(f'<p class="mb-4">{line}</p>')
        i += 1

    if in_table:
        html.append('</tbody></table></div>')

    return '\n'.join(html)

md_file_path = '/mnt/c/shock/temp-markdown/The Best Fundraising Platforms of 2025.md'
with open(md_file_path, 'r') as f:
    md_content = f.read()

html_output = convert_md_to_html(md_content)

with open('/mnt/c/shock/temp-markdown/converted.html', 'w') as f:
    f.write(html_output)

print("Conversion complete. HTML saved to /mnt/c/shock/temp-markdown/converted.html")
