'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ExploreAttractionsSection({ attractions, location_slug }) {
	const [hoveredIndex, setHoveredIndex] = useState(null);
	const [isVisible, setIsVisible] = useState(false);
	const sectionRef = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsVisible(true);
				observer.unobserve(entry.target);
			}
		}, { threshold: 0.1 });

		if (sectionRef.current) observer.observe(sectionRef.current);

		return () => observer.disconnect();
	}, []);

	return (
		<section
			ref={sectionRef}
			className={cn(
				"relative bg-black py-8 sm:py-16 lg:py-24 overflow-hidden transition-opacity duration-700",
				isVisible ? "opacity-100" : "opacity-0"
			)}
		>
			{/* Animated BG */}
			<div className="absolute inset-0 bg-gradient-to-br from-[#ff1152] via-[#ff1152] to-[#ff4d7d] [clip-path:polygon(100%_0,100%_100%,80%_100%,0_0)]" />

			<div className="z-10 relative mx-auto px-6 sm:px-10 lg:px-16 max-w-[1400px]">
				<div className="flex flex-col items-start lg:items-center gap-8 lg:gap-16 lg:grid lg:grid-cols-[0.8fr_1.5fr]">

					{/* LEFT */}
					<div className="flex flex-col justify-center gap-6 lg:gap-8 w-full lg:w-auto">
						<div className="bg-[#39FF14] px-6 py-2 rounded-full w-fit font-semibold text-black text-xs uppercase tracking-wider">
							Discover
						</div>

						<h2 className="font-black text-white text-4xl sm:text-5xl lg:text-6xl uppercase leading-tight">
							Explore <br />
							<span className="text-[#39FF14]">Our</span> Attractions
						</h2>

						<Button variant="neonGreen" size="full" rounded="md" asChild>
							<Link href={`/${location_slug}/attractions`}>
								View Details →
							</Link>
						</Button>
					</div>

					{/* RIGHT GRID */}
					<div className="flex flex-col gap-8 w-full">
						<div className="gap-4 sm:gap-6 grid grid-cols-2 lg:grid-cols-3 w-full">
							{attractions?.map((attraction, index) => {
								const isHovered = hoveredIndex === index;

								return (
									<Link
										key={index}
										href={`/${location_slug}/attractions/${attraction?.path}`}
										onMouseEnter={() => setHoveredIndex(index)}
										onMouseLeave={() => setHoveredIndex(null)}
										className={cn(
											"flex flex-col items-center bg-white overflow-hidden text-center transition-all",
											isHovered && "bg-neon-pink",
											isVisible && `animate-[slideUp_.6s_ease-out_${index * 0.1}s_backwards]`
										)}
									>
										<div className="flex justify-center items-center bg-white/5 w-full aspect-square sm:aspect-4/3 lg:aspect-video overflow-hidden">
											{attraction?.smallimage && (
												<Image
													src={attraction.smallimage}
													width={200} height={200}
													alt={attraction?.iconalttextforhomepage ?? `Attraction ${index + 1}`}
													className="w-full h-full object-cover"
													loading="lazy"
												/>
											)}
										</div>

										<h3 className={cn(
											"p-3 sm:p-4 w-full font-semibold text-black text-xs sm:text-sm uppercase tracking-wide transition",
											isHovered && "bg-neon-pink underline"
										)}>
											{(attraction?.name || attraction?.title || "Attraction").split(" - ").pop()}
										</h3>
									</Link>
								);
							})}
						</div>
					</div>

				</div>
			</div>
		</section>
	);
}
