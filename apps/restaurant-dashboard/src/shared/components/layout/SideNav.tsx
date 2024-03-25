'use client'

import Link from "next/link"
import { activeItem, sideBarItems } from "../../../app/configs/constants"
import { useAtom } from "jotai"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

const SideNav = () => {
    const [activeRoute, setActiveRoute] = useAtom(activeItem);
    const pathname = usePathname();

    useEffect(() => {
        setActiveRoute(pathname)
    }, [pathname, setActiveRoute])

    return (
        <>
            {
                sideBarItems.map((sideBarItem: SideBarItemsTypes) => (
                    <Link
                        href={sideBarItem.url}
                        key={sideBarItem.url}
                        onClick={() => setActiveRoute(sideBarItem.url)}
                        className={`${sideBarItem.url === activeRoute && 'text-[rgb(_91_211_230)]'} flex items-center text-2xl px-2`}
                    >
                        <span className="mr-4 text-3xl">
                            {sideBarItem.icon}
                        </span>
                        {sideBarItem.title}
                    </Link>
                ))
            }
        </>
    )
}

export default SideNav