import PyPDF2

pdf_path = r"c:\Users\RaphaelNeuberger\OneDrive - NewmountainsIT\Desktop\Dev\Developer Akademie\Frontend Module\Modul 12 - Projektstruktur\El Pollo Loco\Vorlage\El Pollo Loco Checkliste.pdf"

with open(pdf_path, 'rb') as file:
    pdf_reader = PyPDF2.PdfReader(file)
    print(f"Anzahl Seiten: {len(pdf_reader.pages)}\n")
    
    for page_num in range(len(pdf_reader.pages)):
        page = pdf_reader.pages[page_num]
        text = page.extract_text()
        print(f"=== Seite {page_num + 1} ===")
        print(text)
        print("\n" + "="*80 + "\n")
