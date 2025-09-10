import { useEffect, useState } from 'react'
import AdminDasboardLayout from '../../../components/layout/AdminDasboardLayout'
import { useMarketer } from "../../../../hooks/useMarketers"
import { toast } from 'react-toastify';
import Joi from 'joi';
import { useSearchParams } from 'react-router';
import { Bounce } from 'react-activity';

export default function AddMarketer() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isUpdating, setUpdating] = useState(false);

  const [search] = useSearchParams();

  const userId = search.get("id");

  const {registerNewMarketer, singleMarketer, updateUser} = useMarketer();

  const handleRegisterMarketer = async () => {
    try {

      const {error} = Joi.object({
        firstName: Joi.string().required(),
        lastName:Joi.string().required(),
        email: Joi.string().email({tlds: {allow: false}}).required(),
        phoneNumber: Joi.string().min(10).required(),
      }).validate({
        firstName,
        lastName,
        email,
        phoneNumber,
      });

      if(error) {
        toast.error(error.message);
        return;
      }

      setUpdating(true);

      if(!userId) {
        const response = await registerNewMarketer({
          firstName,
          lastName,
          email,
          phoneNumber,
        });
  
        console.log(response.data);
  
        toast.success("Marketer registered successfully");
  
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhoneNumber("");
      } else {
        const response = await updateUser(userId, {
          firstName,
          lastName,
          email,
          phoneNumber,
        });
  
        console.log(response.data);
  
        toast.success("Marketer updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occured while trying to register new marketer");
    } finally {
      setUpdating(false);
    }
  }

  const fetchUser = async () => {
    try {
      
      const value = await singleMarketer(userId!!);
      console.log("marketer value", value.data);
      setFirstName(value.data.details.firstName);
      setLastName(value.data.details.lastName);
      setEmail(value.data.details.email);
      setPhoneNumber(value.data.details.phoneNumber);
    } catch (error) {
      
    }

  }

  useEffect(() => {
    if(userId) {
      fetchUser();
    }
  }, [search]);

  return (
    <AdminDasboardLayout header={userId ? 'Update Marketer' : 'Add New Marketer'} showSearch={false}>
      <div className='flex flex-col gap-8'>
        <div className='flex flex-col'>
          <label>First Name</label>
          <input className="border border-2 border-solid border-primary py-2 px-4 rounded-md" value={firstName} onChange={(e) => {setFirstName(e.target.value)}} />
        </div>
        <div className='flex flex-col'>
          <label>Surname</label>
          <input className="border border-2 border-solid border-primary py-2 px-4 rounded-md" value={lastName} onChange={(e) => {setLastName(e.target.value)}} />
        </div>
        <div className='flex flex-col'>
          <label>Email</label>
          <input className="border border-2 border-solid border-primary py-2 px-4 rounded-md" value={email} onChange={(e) => {setEmail(e.target.value)}} />
        </div>
        <div className='flex flex-col'>
          <label>Phone Number</label>
          <input className="border border-2 border-solid border-primary py-2 px-4 rounded-md" value={phoneNumber} onChange={(e) => {setPhoneNumber(e.target.value)}} />
        </div>
        <button className='bg-primary border-none rounded-md py-2 text-white' disabled={isUpdating} onClick={handleRegisterMarketer}>{isUpdating ? <Bounce /> : userId ? "Update Marketer" : "Register Marketer"}</button>
      </div>
    </AdminDasboardLayout>
  )
}
