'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from "@/lib/utils";

export default function ExploreAttractionsSection({ attractions, location_slug }) {
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
				"v11_bp_attractions_section transition-opacity duration-700",
				isVisible ? "opacity-100" : "opacity-0"
			)}
		>
			<div className="v11_bp_container">
				{/* Header */}
				<h2 className="v11_bp_heading">
					Explore Our
					<span className="v11_bp_heading_accent"> Attractions</span>
				</h2>
				<p className="v11_bp_subtext">
					From trampolines to obstacle courses — endless fun for all ages
				</p>

				{/* Attractions Grid */}
				<div className="v11_bp_attractions_grid" style={{ maxWidth: "1100px", margin: "0 auto 2rem" }}>
					{attractions?.slice(0, 8).map((attraction, index) => (
						<Link
							key={index}
							href={`/${location_slug}/attractions/${attraction?.path}`}
							className="v11_bp_attraction_card"
							style={isVisible ? { animation: `v11_cardFadeIn 0.5s ease ${index * 0.08}s forwards`, opacity: 0 } : { opacity: 0 }}
						>
							<div className="v11_bp_attraction_img">
								{attraction?.smallimage && (
									<img
										src={attraction.smallimage}
										alt={attraction?.name || attraction?.title || `Attraction ${index + 1}`}
										loading="lazy"
										style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
									/>
								)}
							</div>
							<div className="v11_bp_attraction_overlay">
								<h3 className="v11_bp_attraction_name">
									{(attraction?.name || attraction?.title || "Attraction").split(" - ").pop()}
								</h3>
								<span className="v11_bp_attraction_more">Learn More →</span>
							</div>
						</Link>
					))}
				</div>

				{/* CTA */}
				<div className="text-center mt-8">
					<Link
						href={`/${location_slug}/attractions`}
						className="inline-block bg-[#FF174A] text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(255,23,74,0.3)] transition-all"
					>
						View All Attractions →
					</Link>
				</div>
			</div>

			<style>{`
				@keyframes v11_cardFadeIn {
					from { opacity: 0; transform: translateY(20px); }
					to { opacity: 1; transform: translateY(0); }
				}
			`}</style>
		</section>
	);
}
