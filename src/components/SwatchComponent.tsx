
export default function SwatchComponent({ colorCode, height = "20px", width = "20px" }: { colorCode: string, height?: string, width?: string }) {
  const colorSamples = colorCode.toLocaleLowerCase().split(",");

  let gradientStyle = {
    backgroundImage: `conic-gradient(${colorSamples[0]} 0% 100%)`,
  };

  if (colorSamples.length == 2) {
    gradientStyle = {
      backgroundImage: `conic-gradient(${colorSamples[0]} 0% 50%, ${colorSamples[1]} 50% 100%)`,
    };
  } else if (colorSamples.length == 3) {
    gradientStyle = {
      backgroundImage: `conic-gradient(${colorSamples[0]} 0% 50%, ${colorSamples[1]} 50% 75%, ${colorSamples[2]} 75% 100%)`,
    };
  } else if (colorSamples.length == 4) {
    gradientStyle = {
      backgroundImage: `conic-gradient(${colorSamples[0]} 0% 25%, ${colorSamples[1]} 25% 50%, ${colorSamples[2]} 50% 75%), ${colorSamples[3]} 75% 100%)`,
    };
  }

  return (
      <div
      style={gradientStyle}
        className={`h-[${height}] w-[${width}] rounded-full mx-auto border border-2 border-[black]`}
      ></div>
  );
}
