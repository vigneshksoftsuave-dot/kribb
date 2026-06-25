import { useAuth, useSignUp } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUp() {
  const { fetchStatus, errors, signUp } = useSignUp();

  const { isSignedIn, isLoaded } = useAuth();

  const router = useRouter();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  const onSignUp = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
    });

    if (error) {
      console.log(JSON.stringify(error));
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const onVerifyCode = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });

    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  const isLoading = fetchStatus === "fetching";

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold mb-2 text-grey-800">
          Verify your Account
        </Text>
        <Text className="mb-8 text-grey-500">We sent an code to {email}</Text>
        <View className="flex-col gap-3 mb-4">
          <TextInput
            placeholder="Enter VerificationCode"
            placeholderTextColor={"#ccc"}
            className="flex-1 px-4 py-7 border rounded-xl border-[#ccc] color-black"
            value={code}
            keyboardType="number-pad"
            onChangeText={(text) => setCode(text)}
          />
          {errors.fields.code && (
            <Text className="text-red-500 mb-4">
              {errors.fields.code.message}
            </Text>
          )}
          <TouchableOpacity
            disabled={isLoading}
            onPress={onVerifyCode}
            className="w-full bg-cyan-800 px-4 py-4 rounded-lg flex-col justify-center items-center"
          >
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text className="text-white">Verfiy</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            disabled={isLoading}
            onPress={() => signUp.verifications.sendEmailCode()}
            className="py-2"
          >
            <Text className="text-blue-600">I need to send a new code</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold mb-2 text-grey-800">
          Create your Account
        </Text>
        <Text className="mb-8 text-grey-500">Find Your Dream Home Today</Text>
        <View className="flex-row gap-3 mb-4">
          <TextInput
            placeholder="First Name"
            placeholderTextColor={"#ccc"}
            className="flex-1 px-4 py-3 border rounded-xl border-[#ccc]"
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
          <TextInput
            placeholder="Last Name"
            placeholderTextColor={"#ccc"}
            className="flex-1 px-4 py-3 border rounded-xl border-[#ccc]"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
        </View>
        <TextInput
          placeholder="Enter Email"
          placeholderTextColor={"#ccc"}
          className={`w-full px-4 py-3 ${errors.fields.emailAddress ? "mb-2" : "mb-4"} border rounded-xl border-[#ccc]`}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        {errors.fields.emailAddress && (
          <Text className="text-red-500 mb-4">
            {errors.fields.emailAddress.message}
          </Text>
        )}
        <TextInput
          placeholder="Enter a Password"
          placeholderTextColor={"#ccc"}
          className={`w-full px-4 py-3  ${errors.fields.password ? "mb-2" : "mb-4"} border rounded-xl border-[#ccc]`}
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
        />
        {errors.fields.password && (
          <Text className="text-red-500 mb-4">
            {errors.fields.password.message}
          </Text>
        )}
        <TouchableOpacity
          disabled={isLoading}
          onPress={onSignUp}
          className="w-full bg-cyan-800 px-4 py-4 mb-4 rounded-lg flex-col justify-center items-center"
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-white">Sign Up</Text>
          )}
        </TouchableOpacity>
        <View className="w-full  flex-row justify-center items-center">
          <Text className="text-[#aaa]">Already Have an Account? </Text>
          <Link href="/sign-in">
            <Text className="text-[#0000FF] font-bold">Sign In</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
