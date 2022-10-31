import Link from "next/link"

export default function Footer() {
    return (
        <footer className="flex p-4 justify-around flex-wrap list-none align-center bg-blue-900 shadow md:flex md:items-center md:justify-between md:p-6">
            <li>
                <Link href="./"><img src="https://img.icons8.com/material-rounded/24/dbeafe/home--v2.png" className="cursor-pointer"/></Link>
            </li>
            <li>
                <Link href="./account"><img src="https://img.icons8.com/material-rounded/24/dbeafe/person-male.png" className="cursor-pointer"/></Link>
            </li>
        </footer>

    )
}