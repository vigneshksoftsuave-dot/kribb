import { useSignIn } from "@clerk/expo";
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

export default function SignIn() {
  const { fetchStatus, errors, signIn } = useSignIn();

  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const isLoading = fetchStatus === "fetching";

  const onSignIn = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodefactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodefactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.log(`Sign-in incomplete: ${signIn.status}`);
    }
  };

  const onVerifyCode = async () => {
    await signIn.mfa.verifyEmailCode({
      code,
    });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            return;
          }
          const url = decorateUrl("/");
          router.replace(url as any);
        },
      });
    }
  };

  if (signIn?.status === "needs_client_trust") {
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
            onPress={() => signIn.mfa.sendEmailCode()}
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
          Welcome Back!
        </Text>
        <Text className="mb-8 text-grey-500">Sign Into Your Account</Text>
        <TextInput
          placeholder="Enter Email"
          placeholderTextColor={"#ccc"}
          className={`w-full px-4 py-3 ${errors.fields.identifier ? "mb-2" : "mb-4"} border rounded-xl border-[#ccc]`}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text)}
        />
        {errors.fields.identifier && (
          <Text className="text-red-500 mb-4">
            {errors.fields.identifier.message}
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
          onPress={onSignIn}
          className="w-full bg-cyan-800 px-4 py-4 mb-4 rounded-lg flex-col justify-center items-center"
        >
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text className="text-white">Sign In</Text>
          )}
        </TouchableOpacity>
        <View className="w-full  flex-row justify-center items-center">
          <Text className="text-[#aaa]">Don't Have an Account? </Text>
          <Link href="/sign-up">
            <Text className="text-[#0000FF] font-bold">Sign UP</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
