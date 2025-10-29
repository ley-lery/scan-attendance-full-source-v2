import { useReportCustomizationStore } from "@/stores/useReportStore";

const CustomizeFooter = () => {
  const { footer } = useReportCustomizationStore();

  return (
    <>
      {/* Signature Section */}
      {footer.showSignatures && (
        <div className="mt-8 pt-4 border-t-2 border-zinc-300">
          <div className="grid grid-cols-3 gap-8 text-xs">
            <div className="text-center">
              <p className="mb-12 font-semibold">Prepared By</p>
              <div className="border-t border-zinc-400 pt-1">
                <p>{footer.preparedBy}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="mb-12 font-semibold">Verified By</p>
              <div className="border-t border-zinc-400 pt-1">
                <p>{footer.verifiedBy}</p>
              </div>
            </div>
            <div className="text-center">
              <p className="mb-12 font-semibold">Approved By</p>
              <div className="border-t border-zinc-400 pt-1">
                <p>{footer.approvedBy}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Info Footer */}
      {footer.showReportInfo && (
        <div className="mt-6 text-center text-xs text-zinc-500 border-t border-zinc-200 pt-2">
          <p>This is a computer-generated report. No signature is required.</p>
          <p>Generated on {new Date().toLocaleString('en-US', { 
            dateStyle: 'full', 
            timeStyle: 'short' 
          })}</p>
        </div>
      )}
    </>
  );
};

export default CustomizeFooter;