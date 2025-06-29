import { Info, Mail, Megaphone, Newspaper, Phone } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {

    const { t } = useTranslation();
    
  return (
    <footer className="bg-blue-800 text-white mt-16 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4" /> {t("About School")}
            </h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>{t("Our Mission")}</li>
              <li>{t("Vision & Values")}</li>
              <li>{t("History")}</li>
              <li>{t("Leadership")}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Newspaper className="w-4 h-4" /> News & Updates
            </h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>{t("Announcements")}</li>
              <li>{t("Events")}</li>
              <li>{t("Newsletter")}</li>
              <li>{t("Student Life")}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Megaphone className="w-4 h-4" /> {t("Explore")}
            </h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>{t("Programs Offered")}</li>
              <li>{t("Admissions")}</li>
              <li>{t("Fees")}</li>
              <li>{t("Gallery")}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" /> {t("Contact Us")}
            </h3>
            <ul className="space-y-2 text-sm text-blue-100">
              <li>
                <Phone className="inline w-4 h-4 mr-2" /> +237 675 089 794
              </li>
              <li>
                <Mail className="inline w-4 h-4 mr-2" /> e-conneq@hotmail.com
              </li>
              <li>Douala, Cameroon</li>
              <li>Mon - Sat: 6:00am - 23:00pm</li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm mt-10 text-blue-200">
          © {new Date().getFullYear()} e-Conneq System. All rights reserved.
        </div>
      </footer>
  );
}

export default Footer;
