import Link from "next/link";
interface BreadcrumbProps {
  department: string;
  pageName: string;
  subRoute?: string;
  mainLink: string;
  subLink?: string;
}
const Breadcrumb = ({ department, pageName, subRoute, mainLink, subLink }: BreadcrumbProps) => {
  return (
    <div className="flex gap-3 items-center justify-between mb-2 mt-2 px-2 sm:flex-row">
      <h2 className="dark:text-white font-semibold text-black text-title-md2">
        {pageName}
      </h2>

      <nav>
        <ol className="flex gap-2 items-center">
          <li>
            <Link className="font-medium" href={`/${mainLink}`}>
            {department} /
            </Link>
          </li>
          <li>
            <Link className="font-medium text-primary" href={`/${mainLink}`}>
            {subRoute}
            </Link>
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
