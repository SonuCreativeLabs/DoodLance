import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { UserCircle } from "lucide-react"

interface ProfileCompletionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCompleteProfile: () => void
    actionLoading?: boolean
}

export default function ProfileCompletionDialog({
    open,
    onOpenChange,
    onCompleteProfile,
    actionLoading = false
}: ProfileCompletionDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#111111] border-white/20 text-white z-[10000]">
                <DialogHeader>
                    <div className="mx-auto bg-purple-500/10 p-4 rounded-full mb-4 border border-purple-500/20">
                        <UserCircle className="w-10 h-10 text-purple-400" />
                    </div>
                    <DialogTitle className="text-xl font-bold text-center">Complete Your Profile</DialogTitle>
                    <DialogDescription className="text-center text-white/60 pt-2">
                        To ensure trust and safety in our community, you need to complete your profile before you can perform this action.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-2">
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <ul className="space-y-3 text-sm text-white/80">
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                                Add your full name
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                                Set your location
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full"></span>
                                Add a profile picture
                            </li>
                        </ul>
                    </div>
                </div>
                <DialogFooter className="flex-col sm:flex-row gap-2 mt-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="w-full border-white/10 text-white hover:bg-white/5 hover:text-white"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onCompleteProfile}
                        disabled={actionLoading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    >
                        {actionLoading ? 'Redirecting...' : 'Complete Profile'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
