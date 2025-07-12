import { QrCodeBase64 } from '@/components/QrCodeBase64';
import jsPDF from 'jspdf';

export const generateIDCardHigh = async (
    { students, imageSource = '/images/idcards/id-background2.jpg' }:
        { students: any[], imageSource?: string }
) => {

    const pdf = new jsPDF({
        orientation: students.length === 1 ? "landscape" : 'portrait',
        unit: 'mm',
        format: students.length === 1 ? [85, 54] : 'a4', // [height, width] for custom size
    });
    const cardWidthMM = 85;
    const cardHeightMM = 54;
    const cardMarginX = students.length === 1 ? 0 : 10;
    const cardMarginY = students.length === 1 ? 0 : 3;;
    const cardsPerPage = 10;
    const cardsPerRow = 2;

    const backgroundImageBase64 = await loadImageToBase64(imageSource);

    for (let i = 0; i < students.length; i++) {
        const student = students[i];

        const protocol = "https://";
        const domain = "yourdomain.com";
        const RootApi = "/api";

        const qrUrl = `${protocol}${domain}${RootApi}/check/${student.id}/idcard/?n=1`;
        const qrCodeBase64 = await QrCodeBase64(qrUrl);

        const indexInPage = i % cardsPerPage;
        const col = indexInPage % cardsPerRow;
        const row = Math.floor(indexInPage / cardsPerRow);
        const x = cardMarginX + col * (cardWidthMM + cardMarginX);
        const y = cardMarginY + row * (cardHeightMM + cardMarginY);

        if (indexInPage === 0 && i !== 0) {
            pdf.addPage();
        }

        pdf.addImage(backgroundImageBase64, 'JPEG', x, y, cardWidthMM, cardHeightMM);

        const centerX = x + cardWidthMM / 2;

        // Use wrapping only if it's too long
        const schoolText = student.schoolName.length > 25
            ? pdf.splitTextToSize(student.schoolName, 52)
            : student.schoolName;

        // pdf.setFont("courier", "bold");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor("#333");

        pdf.text(schoolText, centerX + 14, y + (student.schoolName.length > 25 ? 6 : 8), { align: "center" });

        // FOR LABELS
        pdf.setFont("times", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor("#333");

        pdf.text("Registration No", x + 3, y + 37);
        pdf.text("Matricule", x + 6, y + 40);

        pdf.text(`Full Name:`, x + 29, y + 22);
        pdf.text(`Nom et Prenom:`, x + 29, y + 24.3);
        pdf.text(`Date Of Birth:`, x + 29, y + 29);
        pdf.text(`Date de N.:`, x + 29, y + 31.3);
        pdf.text(`Specialty:`, x + 29, y + 35);
        pdf.text(`Filiere:`, x + 29, y + 37.5);
        pdf.text(`Level:`, x + 29, y + 43);
        pdf.text(`Niveau:`, x + 29, y + 45.3);
        pdf.text(`Academic Year:`, x + 3, y + 48);
        pdf.text(`Annee Academique:`, x + 3, y + 50);

        // FOR MATRICLE
        pdf.setFont("time", "bold");
        pdf.setFontSize(8);
        pdf.setTextColor("#333");



        // FOR DATA
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9);
        pdf.setTextColor("#333");

        pdf.text(`${student.matricle}`, x + 4, y + 44);

        const fullNameText = student.name.length > 15
            ? pdf.splitTextToSize(student.name, 36)
            : student.name;
        // const fullNameText = pdf.splitTextToSize(`${student.name}`, 36);
        pdf.text(fullNameText, x + 50, y + (student.name.length > 15 ? 22 : 23));
        pdf.text(`${student.dob}`, x + 50, y + 30);
        const specialtyText = pdf.splitTextToSize(`${student.specialty.slice(0, 30)}`, 40);
        pdf.text(specialtyText, x + 50, y + 35);
        pdf.text(`${student.level}`, x + 50, y + 44);
        pdf.text(`${student.academicYear}`, x + 29, y + 50);



        pdf.setFont("helvetica", "normal");

        pdf.setFont("courier", "italic");

        // Wrap specialty to max 50 units width
        pdf.setFont("helvetica", "bold");

        if (student.logo) {
            const photoBase64 = await loadImageToBase64(student.logo);
            pdf.addImage(photoBase64, 'JPEG', x + 3, y + 1, 12, 12);
        }

        if (student.photo) {
            const photoBase64 = await loadImageToBase64(student.photo);
            pdf.addImage(photoBase64, 'PNG', x + 3, y + 16, 17, 17);
        }

        if (qrCodeBase64) {
            pdf.addImage(qrCodeBase64, 'PNG', x + 72, y + 41, 12, 12);
        }
    }

    pdf.save('HD-student-id-cards.pdf');
};

const loadImageToBase64 = (url: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/jpeg', 1.0));
        };
        img.src = url;
    });
};
