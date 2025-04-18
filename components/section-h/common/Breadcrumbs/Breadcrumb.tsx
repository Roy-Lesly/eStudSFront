import Link from "next/link";
interface BreadcrumbProps {
  pageName: string;
  pageName1?: string;
  pageName2?: string;
  pageName3?: string;
  link1?: string;
  link2?: string;
  link3?: string;
}
const Breadcrumb = ({ pageName, pageName1, pageName2, pageName3, link1, link2, link3 }: BreadcrumbProps) => {
  return (
    <div className="flex gap-3 items-center justify-between p-2">
      <h2 className="font-semibold md:text-title-md2 text-xl">
        {pageName}
      </h2>

      <nav>
        <ol className="flex gap-2 items-center">
          <li>
            <Link className="font-medium" href={link1 ? link1 : ""}>
              {pageName1}
            </Link>
          </li>

          {pageName2 && <li>
            <Link className="font-medium text-primary" href={link2 ? link2 : "/"}>
              / {pageName2}
            </Link>
          </li>}

          {pageName3 && <li>
            <Link className="font-medium" href={link3 ? link3 : "/"}>
              / {pageName3}
            </Link>
          </li>}

        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
