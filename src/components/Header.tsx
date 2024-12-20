import { Flex, Menu, MenuItem, useAuthenticator } from "@aws-amplify/ui-react";
import UserDetails from "./UserDetails";

const Header = ({ setShadowColor }: {
    setShadowColor: (color: string) => void;
}) => {
    const { user } = useAuthenticator((context) => [context.user]);
    const shadowColors = [
        { color: "var(--amplify-colors-neutral-60)", emoji: "⚪" },
        { color: "var(--amplify-colors-red-60)", emoji: "🔴" },
        { color: "var(--amplify-colors-orange-60)", emoji: "🟠" },
        { color: "var(--amplify-colors-yellow-60)", emoji: "🟡" },
        { color: "var(--amplify-colors-green-60)", emoji: "🟢" },
        { color: "var(--amplify-colors-blue-60)", emoji: "🔵" },
        { color: "var(--amplify-colors-purple-60)", emoji: "🟣" },
    ];

    return (
        <Flex direction="row" justifyContent="space-between" alignItems="center" alignContent="flex-start">
            <UserDetails user={user} />
            <Menu
                menuAlign="center"
                minWidth={20}>
                {shadowColors.map((item) => (
                    <MenuItem minWidth={20} key={item.color} onClick={() => setShadowColor(item.color)}>
                        {item.emoji}
                    </MenuItem>
                ))}
            </Menu>
        </Flex >
    );
};

export default Header;
