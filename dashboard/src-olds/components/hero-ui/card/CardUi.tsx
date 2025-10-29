import { Card, Chip } from '@heroui/react'
import { useTranslation } from 'react-i18next';


interface CardUiProps {
    title: string;
    number: number;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: string;
}

const CardUi = ({
    title,
    number,
    subtitle = "",
    icon = null,
    color,
    ...props    
}: CardUiProps) => {
    const { t } = useTranslation();
  return (
    <Card
        className="card-ui p-4"
        {...props}
    >
        <div className="flex">
        <div className="flex flex-col gap-y-2">
            <h2 className={`text-small font-medium ${color} `}>
                {title}
            </h2>
            <div className={`flex items-center text-2xl font-semibold ${color}`}>
                {number}
                <Chip variant="light" className="text-sm font-medium">
                    {t(subtitle)} 
                </Chip>
            </div>
        </div>
        </div>
        <div
            className={`absolute right-2 top-2 flex items-center gap-2 ${color}`}
        >
            {icon}
        </div>
    </Card>
  )
}

export default CardUi