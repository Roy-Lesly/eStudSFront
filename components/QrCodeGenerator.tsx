import { useRef, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { protocol, RootApi } from '@/utils/config';

const QrCodeGenerator = (
    { data }:
    { data: 
        { 
            domain: string,
            section: "H" | "S" | "P" | "V",
            id: number,
            type: "idcard" | "transcript" | "slip",
            size?: number
        }
    }
) => {
    const u = `${protocol}${data.domain}${RootApi}/check/${data.id}/${data.section}/${data.type}`
    console.log(u);

    const [url, setUrl] = useState(u);
    const qrRef = useRef<HTMLDivElement | null>(null);

    const handleDownload = () => {
        if (!qrRef.current) return;

        const canvas = qrRef?.current?.querySelector('canvas');
        if (!canvas) return;

        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'qr-code.png';
        link.click();
    };


    return (
        <QRCodeCanvas value={url} size={data.size || 130} className='rounded' />
    );
}

export default QrCodeGenerator;