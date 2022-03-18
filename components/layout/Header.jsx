import Link from "next/link";
import { Menu } from "semantic-ui-react";

const Header = () => {
    // vars
    const menuItems = [
        {
            title: "Campaigns",
            href: "/campaigns",
        },
        {
            title: "+",
            href: "/campaigns/new",
        },
    ];

    return (
        <Menu>
            <Link href={"/"}>
                <a>
                    <Menu.Item>CrowdCoin</Menu.Item>
                </a>
            </Link>

            <Menu.Menu position="right">
                {menuItems.map(({ title, href }, i) => (
                    <Link href={href} key={i}>
                        <a>
                            <Menu.Item>{title}</Menu.Item>
                        </a>
                    </Link>
                ))}
            </Menu.Menu>
        </Menu>
    );
};

export default Header;
