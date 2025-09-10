


export default function OtherPageHeader({header, subHeader, bgColor, textColor}: {header: string, subHeader?: string, bgColor?: string, textColor?: string}) {
 if(true != true) { return (
    <div className={`px-8 font-bold text-center`} style={{
      backgroundColor: bgColor ? bgColor : "white",
      color: textColor ? textColor : "black"
    }}>
        <div className='w-full h-full flex flex-col justify-center items-center text-[35px] md:text-[40px] xl:text-[50px]'>
        <div>{header}</div>
        {subHeader && <div className="text-[15px] md:text-[18px] xl:text-[22px]">{subHeader}</div>}
        </div>
    </div>
  )}
  return (<></>);
}
