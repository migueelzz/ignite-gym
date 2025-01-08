import { Input as GluestackInput, InputField, FormControl, FormControlErrorText, FormControlError } from "@gluestack-ui/themed"
import { ComponentProps } from "react"

type Props = ComponentProps<typeof InputField> & {
  errorMessage?: string | null
  isInvalid?: boolean
  isReadOnly?: boolean
}

export function Input({  errorMessage = null, isInvalid = false, isReadOnly = false, ...rest}: Props) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={invalid} w="$full">
      <GluestackInput
        isInvalid={isInvalid}
        h="$14" 
        borderWidth="$0" 
        borderRadius="$md" 
        $focus={{
          borderWidth: 1,
          borderColor: invalid ? "$rose500" : "$green500"
        }}
        $invalid={{
          borderWidth: 1,
          borderColor: "$rose500"
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
      >
        <InputField 
          bg="$gray700" 
          px="$4"
          color="$white"
          fontFamily="$body"
          placeholderTextColor="$gray300"
          {...rest} 
        />
      </GluestackInput>

      <FormControlError>
        <FormControlErrorText color="$rose500">
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>

    </FormControl>
  )
}