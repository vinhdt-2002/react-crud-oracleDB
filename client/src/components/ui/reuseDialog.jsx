import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog";
function ReuseDialog({
  button_action,
  header,
  des,
  handleClick,
  button_submit,
}) {
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger>{button_action}</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">{header}</AlertDialogTitle>
            <AlertDialogDescription className="text-red-400 text-center">
              {des}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-evenly items-center w-full my-2">
            <AlertDialogCancel className="w-1/4 bg-transparent/10 hover:ring-2">
              Quay lại
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white w-1/4 rounded hover:ring-2 hover:bg-red-700 my-1"
              //handleClick={() => handleDelete(customer.CUSTOMER_ID)}
              onClick={handleClick}
            >
              {button_submit}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
export default ReuseDialog;
