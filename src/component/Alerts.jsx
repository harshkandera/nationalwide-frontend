import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

export function AlertDialogComponent({
    triggerText = "Show Dialog",     
    title = "Are you absolutely sure?",  
    description = "This action cannot be undone.",  
    cancelText = "Cancel",          
    actionText = "Continue",         
    onCancel,                       
    onAction,                        
    variant = "outline",           
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant={variant}>{triggerText}</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={onAction}>{actionText}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
