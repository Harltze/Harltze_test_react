import { useEffect, useState } from "react";
import { authStore } from "../../store/authStore";
import { shippingAddressStore } from "../../store/shippingAddressStore";
import OtherPageHeader from "../components/OtherPageHeader";
import DefaultLayout from "../components/layout/DefaultLayout";
import { FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { useNavigate } from "react-router";
import stateAndLGA from "../../utils/stateAndLGA.json";
import { toast } from "react-toastify";
import { errorHandler } from "../../utils/errorHandler";
import { useCMS } from "../../hooks/useCMS";
import { CMSInterface } from "./adminpages/cms-settings";

export default function ShippingAddressPage() {
  const [tabValue, setTabValue] = useState("list"); // list or form

  const [addressIdToEdit, setAddressIdToEdit] = useState("");

  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [cms, setCMS] = useState<CMSInterface | null>(null);
  const {getCMSRecord} = useCMS();
  
    const fetchCMS = async () => {
      try {
        const cmsContent = await getCMSRecord();
        setCMS(cmsContent.data.result);
        console.log(cmsContent.data.result);
      } catch (error) {
        toast.error(errorHandler(error, "Contents failed to load, kindly refresh this page..."));
      }
    }
  useEffect(() => {
      fetchCMS();
    }, []);

  const isLoggedIn = authStore((state) => state.isLoggedIn);

  const shippingAddresses = shippingAddressStore(
    (state) => state.shippingAddresses
  );

  const addShippingAddress = shippingAddressStore(
    (state) => state.addShippingAddress
  );

  const updateShippingAddress = shippingAddressStore(
    state => state.updateShippingAddress
  );

  const removeShippingAddress = shippingAddressStore(
    (state) => state.removeShippingAddress
  );

  const setAddressAsDefault = shippingAddressStore(state => state.setAsDefaultShippingAddress);

  const navigate = useNavigate();

  if (!isLoggedIn) {
    navigate("/");
  }

  const editShippingAddress = (shippingId: string) => {
    const shippingAddressToEdit = shippingAddresses.find(
      (s) => s.id == shippingId
    );

    if (shippingAddressToEdit) {
      setAddressIdToEdit(shippingAddressToEdit.id!!);
      setState(shippingAddressToEdit.state);
      setCity(shippingAddressToEdit.city);
      setAddress(shippingAddressToEdit.address);
    }
    setTabValue("form");
  };

  const addOrUpdateShippingAddressButton = () => {
    if(addressIdToEdit) {
      updateShippingAddress(addressIdToEdit, {state, city, address});
      setAddressIdToEdit("");
    } else {
      addShippingAddress({ state, city, address });
    }
    setTabValue("list");
  };

  return (
    <DefaultLayout socialMediaLinks={cms?.socialMedia} footerLinks={cms?.footer} footerCopyright={cms?.copyrightFooter}>
      <OtherPageHeader header="Shipping address" />
      <div className="text-center">
        <button onClick={() => {navigate("/cart")}} className="border px-4 py-1 rounded-full">Back to Cart</button>
      </div>

      <section
        id="about"
        className="flex flex-col gap-10 py-10 px-10 xl:px-[140px] min-h-[70vh]"
      >
        <div className="py-4 flex justify-between">
          <div className="font-medium text-[25px]">Shipping address List</div>
          {tabValue == "list" && (
            <button
              className="bg-primary text-white px-8 py-2 rounded-xl font-medium"
              onClick={() => {
                setTabValue("form");
              }}
            >
              Add Shipping address
            </button>
          )}
        </div>

        {tabValue == "list" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {shippingAddresses.length > 0 ? (
              shippingAddresses.map((s) => (
                <div
                  className="flex justify-between items-end p-4 rounded-md"
                  style={{
                    boxShadow:
                      "rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
                  }}
                >
                  <div className="flex flex-col gap-2">
                    {s.isDefault && (
                      <div className="bg-[#3E7B27] rounded-xl px-2 text-white text-[12px] w-fit">Selected</div>
                  )}
                    <div>
                      <div className="text-[#aaa] text-[10px]">State</div>
                      <div className="font-medium text[20px]">{(s.state[0].toLocaleUpperCase() + s.state.slice(1))}</div>
                    </div>
                    <div>
                      <div className="text-[#aaa] text-[10px]">City</div>
                      <div className="font-medium text[20px]">{s.city}</div>
                    </div>
                    <div>
                      <div className="text-[#aaa] text-[10px]">Address</div>
                      <div className="font-medium text[20px]">{s.address}</div>
                    </div>
                    {!(s.isDefault) && (
                    <button onClick={() => {setAddressAsDefault(s.id!!)}} className="bg-[#ccc] text-black px-4 py-1 rounded-md font-medium">Select address</button>
                  )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        editShippingAddress(s.id!!);
                      }}
                    >
                      <FaPencil size={20} />
                    </button>
                    {
                      !(s.isDefault) && (
                      <button
                        onClick={() => {
                          removeShippingAddress(s.id!!);
                        }}
                      >
                        <FaTrash size={20} color="red" />
                      </button>
                      )
                    }
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center h-full col-span-2">
                <div className="font-bold text-[40px] pb-10">
                  No shipping address
                </div>
                <button
                  className="bg-primary text-white px-8 py-2 rounded-xl font-medium"
                  onClick={() => {
                    setTabValue("form");
                  }}
                >
                  Add shipping address
                </button>
              </div>
            )}
          </div>
        )}

        {tabValue == "form" && (
          <div className="flex flex-col w-full md:w-[400px] mx-auto">

            <div>
              <label>Address</label>
              <textarea
                value={address}
                placeholder="E.g 12 London street, behind XYZ gas plant, Califonia South."
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                className="w-full py-2 px-4 border border-black rounded-md h-[80px]"
              />
            </div>

            <div>
              <label>State</label>
              <select
                value={state}
                onChange={(e) => {
                  setState(e.target.value);
                }}
                className="w-full py-2 px-4 border border-black rounded-md"
              >
                <option value="">Select State</option>
                {stateAndLGA.map((s, index) => (
                  <option value={s.alias} key={index}>
                    {s.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>City</label>
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                className="w-full py-2 px-4 border border-black rounded-md"
              >
                <option value="">Select City</option>
                {stateAndLGA
                  .find((s) => s.alias == state)
                  ?.lgas.map((lga, index) => (
                    <option value={lga} key={index}>
                      {lga}
                    </option>
                  ))}
              </select>
            </div>

            

            <div className="mt-4">
              <button
                className="w-full py-2 bg-primary text-white font-medium rounded-md"
                onClick={addOrUpdateShippingAddressButton}
              >
                {addressIdToEdit ? "Update" : "Add"} Shipping Address
              </button>
            </div>
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
