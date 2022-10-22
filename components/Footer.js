import Link from "next/link"

export default function Footer() {
    return (
        <footer className="flex p-4 justify-around flex-wrap list-none align-center bg-gray-800 text-[#45646e] shadow md:flex md:items-center md:justify-between md:p-6 ">
            {/* <ul className="flex justify-around flex-wrap text-sm text-gray-500 dark:text-gray-400 sm:mt-0"> */}
                <li>
                    <Link href="./"><img src="https://img.icons8.com/material-rounded/24/45646e/home--v2.png"/></Link>
                </li>
                <li>
                    <Link href="./account"><img src="https://img.icons8.com/material-rounded/24/45646e/person-male.png"/></Link>
                </li>
                <li>
                    <Link href="./motivation"><img src="https://img.icons8.com/material-rounded/24/45646e/fire-element.png"/></Link>
                </li>
            {/* </ul> */}
        </footer>

    )
}