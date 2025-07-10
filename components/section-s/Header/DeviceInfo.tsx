import React, { useEffect, useState } from 'react'
import { UAParser } from 'ua-parser-js';

const DeviceInfo = () => {

    const [deviceInfo, setDeviceInfo] = useState<{ device: string, os: string, browser: string, cpu: string }>();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const parser = new UAParser(); // ✅ Correct way to call it
            const result = parser.getResult();

            setDeviceInfo({
                device: result.device.model || "Unknown",
                os: `${result.os.name} ${result.os.version}`,
                browser: `${result.browser.name} ${result.browser.version}`,
                cpu: result.cpu.architecture || "Unknown",
            });
        }
    }, []);

    // console.log(deviceInfo)
    return (
        <div className='flex flex-col hidden'>
            <div className='flex gap-4'>
                <span>Device: {deviceInfo?.device}</span>
                <span>OS: {deviceInfo?.os}</span>
            </div>
            <div className='flex gap-4'>
                <span>Browser: {deviceInfo?.browser}</span>
                <span>cpu: {deviceInfo?.cpu}</span>
            </div>
        </div>
    )
}

export default DeviceInfo
