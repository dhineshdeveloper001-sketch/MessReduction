import React from "react";
function MessReductionPage() 
{
return(
    <>
    <p className="bg-white"> GHI </p>
 <input className="bg-blue-500 border-blue-50" type="text" name="mess_reduction_name" id="mess_reduction_name " required />
 <input type="number" name="register_no" id="register_no" required/>
 <input type="text" name="department" id="department" required />
 <input type="number" name="year" id="year" required />
<input type="date" name="start_date" id="end_date" required/>
<input type="text" name="no_of_holidays" id="no_of_holidays" required />
<select name="reason" id="reason"> 
<option value=""> Reason</option>   
<option value=""> Study Holidays </option> 
<option value=""> Other Reason </option>
</select>
    </>
)
}
export default MessReductionPage