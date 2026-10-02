
interface HeaderProps {
    title: string,
    icon?: React.ReactNode,
    subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, icon }) => {
    return (
        <div className="font-bold mb-4 flex flex-row gap-16 md:gap-2 w-full justify-between items-center">
            <div className="flex flex-row gap-3 bg-foreground rounded-full items-center px-2 py-1 md:px-4 md:py-2">
                {icon}
                <span className="text-xs md:text-2xl">{title}</span>
            </div>

            {subtitle &&
                <div className="text-[12px] md:text-2xl font-bold mb-4 border-b-2 border-primary w-fit flex flex-row gap-2">
                    <span>{subtitle}</span>
                </div>
            }
        </div>
    )
}