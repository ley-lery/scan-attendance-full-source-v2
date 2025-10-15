import CustomizeFormEdit from "@/components/ui/reports/attendance-report/customize/CustomizeFormEdit";
import type { ReactNode } from "react";

interface ColumnConfig {
  key: string;
  headerLabel: string;
  width?: string;
  textAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  render?: (value: any, row: any, index: number) => ReactNode;
  editable?: boolean;
  type?: 'static' | 'dynamic';
}

interface FooterConfig {
  colSpan?: number;
  content?: ReactNode | ((data: any[]) => ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

interface CustomizeItemListProps {
  data: any[];
  columns: ColumnConfig[];
  headers: { [key: string]: string };
  updateHeader: (key: string, value: string) => void;
  showFooter?: boolean;
  footerConfig?: FooterConfig[];
  striped?: boolean;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

const CustomizeItemList = ({ 
  data, 
  columns,
  headers, 
  updateHeader,
  showFooter = true,
  footerConfig,
  striped = true,
  tableClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = ''
}: CustomizeItemListProps) => {
  
  // Default render function
  const defaultRender = (value: any) => value;


  return (
    <div className="customize-table-wrapper ">
      <table className={`w-full border-collapse border border-zinc-300 dark:border-zinc-700 text-xs customize-table ${tableClassName}`} style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr className={`bg-zinc-200 dark:bg-zinc-800 ${headerClassName}`}>
            {columns.map((column) => (
              <CustomizeFormEdit 
                key={column.key}
                value={headers[column.key]} 
                onValueChange={(value) => updateHeader(column.key, value)} 
                layouts={{ 
                  width: column.width || 'auto', 
                  textAlign: column.textAlign || 'center',
                  verticalAlign: column.verticalAlign || 'middle'
                }} 
                type={column.type || "static"} 
                tag="th"
                className="whitespace-nowrap"
              >
                {headers[column.key]}
              </CustomizeFormEdit>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {data.map((row: any, rowIndex: number) => (
            <tr 
              key={rowIndex}
              className={striped && rowIndex % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50 dark:bg-zinc-800'}
            >
              {columns.map((column) => {
                const value = column.key === 'no' ? rowIndex + 1 : row[column.key];
                const renderFn = column.render || defaultRender;
                const content = renderFn(value, row, rowIndex);

                return (
                  <CustomizeFormEdit 
                    key={`${rowIndex}-${column.key}`}
                    value={String(value || '')} 
                    onValueChange={(val) => updateHeader(column.key, val)} 
                    layouts={{ 
                      width: column.width || 'auto', 
                      textAlign: column.textAlign || 'left',
                      verticalAlign: column.verticalAlign || 'middle'
                    }} 
                    type={column.editable === false ? "dynamic" : "dynamic"} 
                    tag="td"
                  >
                    {content}
                  </CustomizeFormEdit>
                );
              })}
            </tr>
          ))}
        </tbody>
        {showFooter && (
          <tfoot className={footerClassName}>
            <tr className="bg-zinc-100 dark:bg-zinc-800 font-semibold">
              {footerConfig ? (
                footerConfig.map((config, index) => (
                  <td 
                    key={index}
                    colSpan={config.colSpan || 1}
                    className={`border border-zinc-300 dark:border-zinc-700 px-2 py-2 ${config.className || ''}`}
                    style={config.style}
                  >
                    {typeof config.content === 'function' ? config.content(data) : config.content}
                  </td>
                ))
              ) : (
                <td colSpan={columns.length} className="border border-zinc-300 dark:border-zinc-700 px-2 py-2 text-center">
                  Total Records: {data.length}
                </td>
              )}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default CustomizeItemList;