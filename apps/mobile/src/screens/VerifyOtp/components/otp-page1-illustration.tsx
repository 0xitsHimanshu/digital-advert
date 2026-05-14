import { useId, useMemo } from "react";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import type { SvgProps } from "react-native-svg";

const VB_W = 477;
const VB_H = 500;

type OtpPage1IllustrationProps = Omit<SvgProps, "viewBox">;

/**
 * OTP “Page-1” hero — vector from design (477×500 viewBox).
 * Gradient `id`s are uniquified so multiple instances never clash.
 */
export function OtpPage1Illustration({
  width = "100%",
  height = "100%",
  preserveAspectRatio = "xMidYMid meet",
  ...rest
}: OtpPage1IllustrationProps) {
  const prefix = useId().replace(/[^a-zA-Z0-9_-]/g, "") || "otp";
  const id = useMemo(
    () => ({
      a: `${prefix}a`,
      b: `${prefix}b`,
      c: `${prefix}c`,
      d: `${prefix}d`,
      e: `${prefix}e`,
      f: `${prefix}f`,
      g: `${prefix}g`,
      h: `${prefix}h`,
      i: `${prefix}i`,
    }),
    [prefix]
  );

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      fill="none"
      preserveAspectRatio={preserveAspectRatio}
      {...rest}
    >
      <Path
        clipRule="evenodd"
        d="M238.295 457.393c108.329 0 196.147-87.818 196.147-196.147 0-108.33-87.818-196.148-196.147-196.148S42.148 152.916 42.148 261.246c0 108.329 87.818 196.147 196.147 196.147Z"
        stroke="#3691af"
        strokeWidth={1.085}
        strokeDasharray="6.51 6.51"
      />
      <Path
        clipRule="evenodd"
        d="M238.297 499c131.308 0 237.755-106.447 237.755-237.755S369.605 23.491 238.297 23.491.542 129.937.542 261.245 106.99 499 238.297 499Z"
        stroke="#3691af"
        strokeWidth={1.085}
        strokeDasharray="6.51 6.51"
      />
      <Path
        d="M397.421 336.99c.007-27.681-21.053-50.82-48.612-53.411s-52.563 16.215-57.717 43.412l-164.837-4.471 1.81 28.319s-23.505 54.234 100.029 68.685v54.815h142.811V383.2a53.6 53.6 0 0 0 26.516-46.21"
        fill={`url(#${id.a})`}
      />
      <Path
        d="M133.724 352.028s-22.508 51.936 95.795 65.792v52.517h136.768V331.258l-234.32-6.354z"
        fill="#feceb8"
      />
      <Path
        d="M202.077 135.295c-7.424 11.715-22.915 15.235-34.673 7.879l-73.433-48.39C82.256 87.36 78.736 71.87 86.092 60.112c7.423-11.7 22.894-15.217 34.646-7.88l73.433 48.39c11.725 7.416 15.257 22.909 7.906 34.673"
        fill={`url(#${id.b})`}
      />
      <Path d="M198.01 132.653c-6.901 10.889-21.3 14.161-32.229 7.324L97.499 94.962c-10.889-6.9-14.161-21.3-7.324-32.229 6.9-10.889 21.3-14.161 32.229-7.324l68.269 44.988c10.909 6.898 14.19 21.318 7.337 32.256m142.316 257.47c28.367 0 51.362-22.996 51.362-51.362s-22.995-51.362-51.362-51.362c-28.366 0-51.361 22.996-51.361 51.362s22.995 51.362 51.361 51.362" fill="#feceb8" />
      <Path
        d="M331.079 0H134.324a8.09 8.09 0 0 0-8.09 8.09v368.163a8.09 8.09 0 0 0 8.09 8.09h196.755a8.09 8.09 0 0 0 8.09-8.09V8.09a8.09 8.09 0 0 0-8.09-8.09"
        fill={`url(#${id.c})`}
      />
      <Path d="M327.276 5.196h-189.16a9.01 9.01 0 0 0-9.009 9.008V370.15a9.01 9.01 0 0 0 9.009 9.008h189.16a9.01 9.01 0 0 0 9.008-9.008V14.205a9.01 9.01 0 0 0-9.008-9.009" fill="#fff" />
      <Path d="M284.742 14.576a16.794 16.794 0 0 1-16.557 14.285h-71.55a16.795 16.795 0 0 1-16.551-14.285h-37.908a7.87 7.87 0 0 0-7.873 7.866v339.461a7.867 7.867 0 0 0 7.866 7.872h181.05a7.87 7.87 0 0 0 7.872-7.866V22.449a7.865 7.865 0 0 0-7.865-7.872z" fill="#3691af" />
      <Path d="M254.755 19.045h-43.529a1.32 1.32 0 0 0-1.321 1.321v.245c0 .73.591 1.32 1.321 1.32h43.529a1.32 1.32 0 0 0 1.32-1.32v-.245c0-.73-.591-1.32-1.32-1.32m11.129 3.308a2.151 2.151 0 1 0 0-4.303 2.151 2.151 0 0 0 0 4.303" fill="#dbdbdb" />
      <Path
        d="M373.526 347.822c-14.906 3.447-25.136-6.274-28.583-21.174l-34.25-127.178c-3.408-14.958 5.9-29.86 20.836-33.359 14.957-3.408 29.86 5.901 33.359 20.837l27.949 130.461c3.447 14.906-4.412 26.965-19.311 30.413"
        fill={`url(#${id.d})`}
      />
      <Path d="M361.044 190.06c-2.906-12.577-15.458-20.417-28.035-17.511s-20.416 15.458-17.511 28.035l31.495 136.307c2.906 12.577 15.457 20.417 28.034 17.511s20.417-15.457 17.511-28.034z" fill="#feceb8" />
      <Path d="M391.469 453.153H195.982v45.57h195.487z" fill={`url(#${id.e})`} />
      <Path d="M386.185 458.437h-184.92V494.1h184.92z" fill="#3691af" />
      <Path
        d="M173.573 271.727c-7.334 11.575-22.64 15.054-34.257 7.786l-49.248-31.866c-11.575-7.333-15.054-22.639-7.786-34.256 7.334-11.576 22.639-15.055 34.256-7.786l49.248 31.865c11.576 7.334 15.055 22.64 7.787 34.257"
        fill={`url(#${id.f})`}
      />
      <Path
        d="M161.212 339.176c-7.399 11.682-22.845 15.194-34.567 7.86L96.14 324.792c-11.682-7.399-15.194-22.844-7.86-34.567 7.4-11.681 22.845-15.193 34.567-7.859l30.506 22.25c11.677 7.399 15.188 22.839 7.859 34.56"
        fill={`url(#${id.g})`}
      />
      <Path
        opacity={0.5}
        d="M232.697 251.576c32.806 0 59.399-26.594 59.399-59.399s-26.593-59.399-59.399-59.399-59.399 26.594-59.399 59.399 26.594 59.399 59.399 59.399"
        fill={`url(#${id.h})`}
      />
      <Path d="M232.696 248.083c30.876 0 55.906-25.03 55.906-55.905 0-30.876-25.03-55.906-55.906-55.906s-55.905 25.03-55.905 55.906 25.03 55.905 55.905 55.905" fill="#fff" />
      <Path d="m208.433 184.715 20.962 19.218 29.699-43.674 10.488 8.738-40.187 52.411-29.7-33.193z" fill="#555" />
      <Path d="M158.747 337.518c-6.9 10.889-21.299 14.161-32.229 7.324l-28.45-20.711c-10.89-6.901-14.162-21.3-7.325-32.229 6.9-10.889 21.3-14.161 32.229-7.324l28.445 20.751c10.867 6.897 14.14 21.266 7.33 32.189m12.119-67.541c-6.901 10.889-21.3 14.161-32.229 7.324l-46.336-29.983c-10.89-6.901-14.161-21.3-7.324-32.229 6.9-10.89 21.3-14.162 32.229-7.325l46.336 29.984c10.889 6.901 14.161 21.3 7.324 32.229" fill="#feceb8" />
      <Path
        d="M186.308 204.594c-7.37 11.626-22.745 15.119-34.415 7.819l-62.41-40.636c-11.627-7.37-15.12-22.745-7.82-34.415 7.37-11.626 22.745-15.12 34.415-7.819l62.411 40.636c11.626 7.37 15.119 22.744 7.819 34.415"
        fill={`url(#${id.i})`}
      />
      <Path d="M182.992 202.481c-6.9 10.889-21.299 14.161-32.229 7.324l-58.454-38.061c-10.89-6.9-14.162-21.3-7.324-32.229 6.9-10.889 21.3-14.161 32.229-7.324l58.448 38.061c10.891 6.898 14.166 21.298 7.33 32.229" fill="#feceb8" />
      <Defs>
        <SvgLinearGradient
          id={id.a}
          x1={261.848}
          y1={474.372}
          x2={261.848}
          y2={283.35}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="gray" stopOpacity={0.25} />
          <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
          <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
        </SvgLinearGradient>
        <SvgLinearGradient
          id={id.b}
          x1={144.078}
          y1={147.024}
          x2={144.078}
          y2={48.396}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="gray" stopOpacity={0.25} />
          <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
          <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
        </SvgLinearGradient>
        <SvgLinearGradient
          id={id.c}
          x1={232.702}
          y1={384.337}
          x2={232.702}
          y2={-0.007}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="gray" stopOpacity={0.25} />
          <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
          <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
        </SvgLinearGradient>
        <SvgLinearGradient
          id={id.d}
          x1={351.811}
          y1={348.509}
          x2={351.811}
          y2={165.398}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="gray" stopOpacity={0.25} />
          <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
          <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
        </SvgLinearGradient>
        <SvgLinearGradient
          id={id.e}
          x1={293.739}
          y1={498.71}
          x2={293.739}
          y2={453.14}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="gray" stopOpacity={0.25} />
          <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
          <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
        </SvgLinearGradient>
        <SvgLinearGradient
          id={id.f}
          x1={127.917}
          y1={283.311}
          x2={127.917}
          y2={201.814}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="gray" stopOpacity={0.25} />
          <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
          <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
        </SvgLinearGradient>
        <SvgLinearGradient
          id={id.g}
          x1={124.749}
          y1={350.866}
          x2={124.749}
          y2={278.529}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="gray" stopOpacity={0.25} />
          <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
          <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
        </SvgLinearGradient>
        <SvgLinearGradient
          id={id.h}
          x1={232.697}
          y1={251.576}
          x2={232.697}
          y2={132.771}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="gray" stopOpacity={0.25} />
          <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
          <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
        </SvgLinearGradient>
        <SvgLinearGradient
          id={id.i}
          x1={133.982}
          y1={216.25}
          x2={133.982}
          y2={125.752}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="gray" stopOpacity={0.25} />
          <Stop offset={0.54} stopColor="gray" stopOpacity={0.12} />
          <Stop offset={1} stopColor="gray" stopOpacity={0.1} />
        </SvgLinearGradient>
      </Defs>
    </Svg>
  );
}
