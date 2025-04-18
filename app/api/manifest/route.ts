import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    // Extract subdomain from the host header
    const hostname = req.headers.get('host') || '';
    const subdomain = hostname.split('.')[0]; // Adjust if more complex subdomain patterns are needed

    // Define different manifest configurations based on subdomain
    const manifests: Record<string, any> = {
        'default': {
            name: 'School Management System (E-conneq)',
            short_name: 'DEFAULT E-CONNEQ SCHOOLS',
            start_url: '/test',
            id: '/test',
            display: 'standalone',
            background_color: '#f0f0f0',
            theme_color: '#336699',
            icons: [
                {
                    "src": "http://127.0.0.1:3000/images/logo/LogoEconneq512.png",
                    "type": "image/png",
                    "sizes": "512x512",
                    "purpose": "any"
                }
            ],
            screenshots: [
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoEconneq512.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "narrow",
                    label: "Wonder Widgets"
                },
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoEconneq512.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "wide",
                    label: "Wonder Widgets"
                }
            ]
        },
        'test': {
            name: 'School Management System (E-conneq)',
            short_name: 'E-CONNEQ SCHOOLS',
            start_url: '/test',
            id: '/test',
            display: 'standalone',
            background_color: '#f0f0f0',
            theme_color: '#336699',
            icons: [
                {
                    "src": "http://127.0.0.1:3000/images/logo/LogoEconneq512.png",
                    "type": "image/png",
                    "sizes": "512x512",
                    "purpose": "any"
                }
            ],
            screenshots: [
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoEconneq512.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "narrow",
                    label: "Wonder Widgets"
                },
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoEconneq512.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "wide",
                    label: "Wonder Widgets"
                }
            ]
        },
        'brains': {
            name: 'The Brains School Management System',
            short_name: 'THE BRAINS SYSTEM',
            start_url: '/brains',
            id: '/brains',
            display: 'standalone',
            background_color: '#f0f0f0',
            theme_color: '#336699',
            icons: [
                {
                    "src": "http://127.0.0.1:3000/images/logo/LogoBrains.png",
                    "type": "image/png",
                    "sizes": "512x512",
                    "purpose": "any"
                }
            ],
            screenshots: [
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoBrains320.png",
                    sizes: "320x320",
                    type: "image/png",
                    form_factor: "narrow",
                    label: "Wonder Widgets"
                },
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoBrains.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "wide",
                    label: "Wonder Widgets"
                }
            ]
        },
        'joan': {
            name: 'St Joan School Management System',
            short_name: 'ST JOAN SCHOOL SYSTEM',
            start_url: '/joan',
            id: '/joan',
            display: 'standalone',
            background_color: '#f0f0f0',
            theme_color: '#336699',
            icons: [
                {
                    "src": "http://127.0.0.1:3000/images/logo/LogoJoan.png",
                    "type": "image/png",
                    "sizes": "512x512",
                    "purpose": "any"
                }
            ],
            screenshots: [
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoJoan.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "narrow",
                    label: "Wonder Widgets"
                },
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoJoan.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "wide",
                    label: "Wonder Widgets"
                }
            ]
        },
        'vishi': {
            name: 'Vishi School Management System',
            short_name: 'VISHI SCHOOL SYSTEM',
            start_url: '/vishi',
            id: '/vishi',
            display: 'standalone',
            background_color: '#f0f0f0',
            theme_color: '#336699',
            icons: [
                {
                    "src": "http://127.0.0.1:3000/images/logo/LogoVishi.png",
                    "type": "image/png",
                    "sizes": "512x512",
                    "purpose": "any"
                }
            ],
            screenshots: [
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoVishi.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "narrow",
                    label: "Wonder Widgets"
                },
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoVishi.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "wide",
                    label: "Wonder Widgets"
                }
            ]
        },
        'kings': {
            name: 'Kings School Management System',
            short_name: 'KINGS SCHOOL SYSTEM',
            start_url: '/test',
            id: '/test',
            display: 'standalone',
            background_color: '#f0f0f0',
            theme_color: '#336699',
            icons: [
                {
                    "src": "http://127.0.0.1:3000/images/logo/LogoKings.png",
                    "type": "image/png",
                    "sizes": "512x512",
                    "purpose": "any"
                }
            ],
            screenshots: [
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoKings.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "narrow",
                    label: "Wonder Widgets"
                },
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoKings.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "wide",
                    label: "Wonder Widgets"
                }
            ]
        },
        'stjohn': {
            name: 'Saint John School Management System',
            short_name: 'SAINT JOHN SCHOOL SYSTEM',
            start_url: '/stjohn',
            id: '/stjohn',
            display: 'standalone',
            background_color: '#f0f0f0',
            theme_color: '#336699',
            icons: [
                {
                    "src": "http://127.0.0.1:3000/images/logo/LogoStJohn.png",
                    "type": "image/png",
                    "sizes": "512x512",
                    "purpose": "any"
                }
            ],
            screenshots: [
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoStJohn320.png",
                    sizes: "320x320",
                    type: "image/png",
                    form_factor: "narrow",
                    label: "Wonder Widgets"
                },
                {
                    src: "http://127.0.0.1:3000/images/logo/LogoStJohn.png",
                    sizes: "512x512",
                    type: "image/png",
                    form_factor: "wide",
                    label: "Wonder Widgets"
                }
            ]
        },
    };

    const manifest = manifests[subdomain] || manifests['default'];
    return NextResponse.json(manifest);
}
