import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import AuthSidebar from "@/components/authSidebar";
import Layout from "@/components/layout";
import api from "@/services/api";
import { authAction } from "@/store/slices/authInfo";
import { pinAction } from "@/store/slices/setPin";
import NoAuthRoute from "@/utils/wrapper/noAuthRoute";

function Login() {
	// local state
	const [passwordShown, setPasswordShown] = useState(false);
	const [form, setForm] = useState({ email: "", password: "" });
	const [error, setError] = useState({ email: "", password: "", login: "" });
	const [isLoading, setIsLoading] = useState(false);

	// redux state
	const auth = useSelector((state) => state.auth);
	const pin = useSelector((state) => state.pin);

	const dispatch = useDispatch();

	const router = useRouter();

	const togglePass = (e) => {
		e.preventDefault();
		setPasswordShown(!passwordShown);
	};

	const onChangeForm = (e) => {
		setError({ ...error, [e.target.name]: "" });
		return setForm((form) => {
			return {
				...form,
				[e.target.name]: e.target.value,
			};
		});
	};

	const submitHandler = async (e) => {
		e.preventDefault();a
		if (!form.email || !form.password || isLoading) return;
		setIsLoading(true);
		api.post("/auth/login", form)
			.then((data) => {
				setIsLoading(false);
				const response = data?.data?.data;

				
				if (!response.pin) {
					dispatch(
						pinAction.setPin({
							id: response?.id,
							token: response?.token,
						})
					);
					router.push("/auth/set-pin");
					return;
				}

				dispatch(
					authAction.assignAuth({
						id: response?.id,
						token: response?.token,
					})
				);
				router.push("/dashboard");

				console.log(data.data.data);
			})
			.catch((err) => {
				setIsLoading(false);
				if (err.response?.data?.msg === "Account not active") {
					return setError({
						login: "Please activate your account first!",
					});
				}
				setError({
					email: "Incorrect email 82 or password",
					password: "Incorrect email or password 83",L
				});
				// console.log(error);
			});
	};

	useEffect(() => {
		console.log(pin);
	}, [pin]);

	return (
		<Layout title={"Login"}>
			<main className="flex flex-col md:flex-row">
				<AuthSidebar className="md:flex-[5_5_0%] md:h-screen" />
				<section className="flex-[4_4_0%] h-screen flex flex-col justify-center global-px pl-10 gap-6">
					<h2 className="font-bold text-2xl text-dark">
						Start Accessing Banking Needs With All Devices and All
						Platforms With 30.000+ Users
					</h2>
					<p className="text-dark text-opacity-60">
						Transfering money is easier than ever, you can access
						FazzPay wherever you are. Desktop, laptop, mobile phone?
						we cover all of that for you!
					</p>
					<form
						onSubmit={submitHandler}
						className="text-dark space-y-4"
					>
						<label
							htmlFor="email"
							className={`border-b-2 ${
								form.email !== ""
									? error.email
										? "border-error stroke-error"
										: "border-primary stroke-primary"
									: "border-gray-400 stroke-gray-500"
							} flex gap-4 px-1 py-2 items-center focus-within:border-primary duration-150 focus-within:stroke-primary placeholder-shown:border-gray-400`}
						>
							<svg
								width="22"
								height="16"
								viewBox="0 0 22 16"
								fill="none"
								// stroke="#A9A9A9"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M21 1H1V15H21V1Z"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M2 2L11 9L20 2"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
							</svg>
							<input
								id="email"
								name="email"
								type="email"
								className="peer focus:outline-none w-full"
								onChange={onChangeForm}
								value={form.email}
								placeholder="Enter your e-mail"
								required
							></input>
						</label>
						<label
							htmlFor="password"
							className={`border-b-2 ${
								form.password !== ""
									? error.password
										? "border-error stroke-error"
										: "border-primary stroke-primary"
									: "border-gray-400 stroke-gray-500"
							} flex gap-4 px-1 py-2 items-center focus-within:border-primary duration-150 focus-within:stroke-primary placeholder-shown:border-gray-400`}
						>
							<svg
								width="24"
								height="16"
								viewBox="0 0 14 22"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M15 9H1V19H15V9Z"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								/>
								<path
									d="M13 7V6C13 3.23858 10.7614 1 8 1C5.23858 1 3 3.23858 3 6V7"
									strokeWidth="2"
									strokeLinecap="square"
									strokeLinejoin="round"
								/>
							</svg>

							<input
								id="password"
								name="password"
								type={passwordShown ? "text" : "password"}
								className="peer focus:outline-none w-full"
								value={form.password}
								onChange={onChangeForm}
								placeholder="Enter your password"
								required
							/>
							<button type="button" onClick={togglePass}>
								<svg
									width="22"
									height="19"
									viewBox="0 0 22 19"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="stroke-gray-400"
								>
									<path
										d="M21 9C21 9 18 15 11 15C4 15 1 9 1 9C1 9 4 3 11 3C18 3 21 9 21 9Z"
										strokeOpacity="0.6"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									<path
										d="M11 12C12.6569 12 14 10.6569 14 9C14 7.34315 12.6569 6 11 6C9.34315 6 8 7.34315 8 9C8 10.6569 9.34315 12 11 12Z"
										strokeOpacity="0.6"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									/>
									{passwordShown ? (
										<path
											d="M2 18L19 1"
											strokeOpacity="0.6"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									) : (
										""
									)}
								</svg>
							</button>
						</label>
						<div className="text-right">
							<Link
								href={"/auth/forgotpass"}
								className="text-dark opacity-80 text-sm"
							>
								Forgot Password?
							</Link>
						</div>
						<p className="min-h-6 text-center text-error text-sm flex items-center justify-center gap-1">
							{error.email || error.login ? (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									className="inline-block w-4 h-4 stroke-current"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							) : (
								""
							)}
							{error.email ?? error.password ?? error.login ?? ""}
						</p>
						<button
							type="submit"
							className={`submit btn btn-block bg-primary border-2 border-white capitalize hover:bg-primary-focus hover:border-gray-200 ${
								isLoading ? "loading" : ""
							}`}
							disabled={
								!form.email ||
								!form.password ||
								(isLoading && true)
							}
						>
							Login
						</button>
					</form>
					<p className="text-dark text-opacity-80 text-center">
						Don’t have an account? Let’s{" "}
						<Link
							className="text-primary font-semibold"
							href={"/auth/signup"}
						>
							Sign Up
						</Link>
					</p>
				</section>
			</main>
		</Layout>
	);
}

export default NoAuthRoute(Login);
