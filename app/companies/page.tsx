import Link from "next/link";
import {sourceRegistry} from "../../lib/sources";
export const metadata={title:"Companies Hiring in the USA | USA Job Market",description:"Browse employers with configured USA job feeds and explore their available opportunities."};
export default function CompaniesPage(){return <main className="directory-page"><div className="container"><span className="eyebrow">USA employers</span><h1>Companies Hiring in the USA</h1><p className="directory-intro">Explore employers with configured job feeds and open opportunities across the United States.</p><div className="directory-grid">{sourceRegistry.map(s=><Link key={s.token} href={"/companies/"+s.token}>{s.company}<small>{s.provider==="greenhouse"?"Greenhouse":"Lever"}</small></Link>)}</div></div></main>}
