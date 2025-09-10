import { useEffect, useState } from 'react'
import AdminDasboardLayout from '../../../components/layout/AdminDasboardLayout'
import { useAffiliate } from "../../../../hooks/useAffiliate"
import { toast } from 'react-toastify';
import Joi from 'joi';
import { useSearchParams } from 'react-router';
import { Bounce } from 'react-activity';

export default function AddAffiliate() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [isUpdating, setUpdating] = useState(false);

  const [search] = useSearchParams();
  
  const userId = search.get("id");

  const {registerNewAffiliate, singleAffiliate, updateUser} = useAffiliate();

  const handleRegisterAffiliate = async () => {
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
        const response = await registerNewAffiliate({
          firstName,
          lastName,
          email,
          phoneNumber,
        });
  
        console.log(response.data);
  
        toast.success("Affiliate registered successfully");
  
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
  
        toast.success("Affiliate updated successfully");
      }


    } catch (error) {
      console.log(error);
      toast.error("An error occured while trying to register new affiliate");
    } finally {
      setUpdating(false);
    }
  }

  const fetchUser = async () => {
    try {
      
      const value = await singleAffiliate(userId!!);
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
    <AdminDasboardLayout header='Add New Affiliate' showSearch={false}>
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
        <button className='bg-primary border-none rounded-md py-2 text-white' disabled={isUpdating} onClick={handleRegisterAffiliate}>{isUpdating ? <Bounce /> : userId ? "Update Affiliate" : "Register Affiliate"}</button>
      </div>
    </AdminDasboardLayout>
  )
}
