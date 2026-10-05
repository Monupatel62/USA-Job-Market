import Link from "next/link";
import {usaCities} from "../../lib/cities";
export const metadata={title:"Jobs by City | USA Job Market",description:"Browse USA jobs by major city and discover opportunities across the United States."};
export default function CitiesPage(){return <main className="directory-page"><div className="container"><span className="eyebrow">Major USA cities</span><h1>Jobs by City</h1><p className="directory-intro">Explore job opportunities in major US cities across technology, healthcare, finance, engineering, retail, government and more.</p><div className="directory-grid">{usaCities.map(([slug,name,state])=><Link key={slug} href={"/cities/"+slug}><span>{name}</span><small>{state}</small></Link>)}</div></div></main>}
