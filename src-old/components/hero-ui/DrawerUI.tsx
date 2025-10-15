import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
} from "@heroui/react";

interface DrawerUIProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  children?: React.ReactNode;
}

const DrawerUI =({isOpen, onOpenChange, children}: DrawerUIProps)=> {

  return (
    <>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">Drawer Title</DrawerHeader>
              <DrawerBody>
                  {children}
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
export default DrawerUI;
