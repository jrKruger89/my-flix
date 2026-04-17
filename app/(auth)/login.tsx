import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  function validateAndSubmit() {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!trimmedEmail.includes("@")) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    if (!isValid) return;

    // Temporary behavior until backend auth exists
    router.replace("/(tabs)");
  }

  return (
    <LinearGradient
      colors={["#171739", "#3b1f63", "#16193a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.topBlock}>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Enter your Email here"
          placeholderTextColor="#9d9daf"
        />
        {!!emailError && <Text style={styles.errorText}>{emailError}</Text>}

        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
          placeholder="Enter your password here"
          placeholderTextColor="#9d9daf"
        />
        {!!passwordError && (
          <Text style={styles.errorText}>{passwordError}</Text>
        )}

        <Text style={styles.switchText}>
          Don't have an account?{" "}
          <Link href="/(auth)/signup" style={styles.switchLink}>
            Sign up here
          </Link>
        </Text>
      </View>

      <Pressable style={styles.button} onPress={validateAndSubmit}>
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 100,
    paddingBottom: 24,
  },
  topBlock: {
    alignItems: "center",
    marginBottom: 42,
  },
  title: {
    color: "#f1f1f7",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    color: "#dfdfea",
    fontSize: 16,
    marginTop: 8,
  },
  form: {
    gap: 14,
  },
  label: {
    color: "#e8e8f0",
    fontSize: 16,
    marginBottom: -8,
  },
  input: {
    backgroundColor: "#dfdfdf",
    borderWidth: 2,
    borderColor: "#b73ad0",
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1f1f1f",
  },
  errorText: {
    color: "#ffd4d4",
    fontSize: 13,
    marginTop: -8,
  },
  switchText: {
    color: "#d7d7e6",
    marginTop: 8,
    fontSize: 16,
  },
  switchLink: {
    color: "#d7d7e6",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
  button: {
    marginTop: "auto",
    backgroundColor: "#7e2197",
    borderWidth: 2,
    borderColor: "#b73ad0",
    borderRadius: 10,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  buttonText: {
    color: "#f2e9f6",
    fontSize: 20,
    fontWeight: "700",
  },
});
