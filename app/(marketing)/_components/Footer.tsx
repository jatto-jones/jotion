import { Button } from "@/components/ui/Button";
import Logo from "./Logo";

const Footer = () => {
  return (
    <div className="dark:bg-[#1f1f1f] flex items-center w-full bg-background z-50 p-6">
      <Logo />
      <div className="md:ml-auto w-full flex justify-between md:justify-end items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost" size="sm">
          Privacy Policy
        </Button>
        <Button variant="ghost" size="sm">
          Terms & Conditions
        </Button>
      </div>
    </div>
  );
};

export default Footer;
