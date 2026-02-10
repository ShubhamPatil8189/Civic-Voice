import { cn } from "@/lib/utils";

const FeatureCard = ({ icon: Icon, title, description, className }) => {
  return (
    <div className={cn("card-elevated p-6", className)}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
