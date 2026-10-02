"use client";

// ---------------------------------------------------------------------------
// Minimal social icon SVGs (lucide-react doesn't ship these)
// ---------------------------------------------------------------------------


const InstagramIcon = ({ className }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
		<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
		<circle cx="12" cy="12" r="4" />
		<circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0" />
	</svg>
);

const LinkedInIcon = ({ className }: { className?: string }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
		<circle cx="4" cy="4" r="2" />
	</svg>
);


const SOCIAL_ICONS = {
	instagram: InstagramIcon,
	linkedin: LinkedInIcon,
} as const;

type SocialKey = keyof typeof SOCIAL_ICONS;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function SiteFooter() {

	const socials = [
		{ key: "instagram", href: "https://www.instagram.com/lattiz/", label: "Instagram" },
		{ key: "linkedin", href: "https://www.linkedin.com/company/lattiz/", label: "LinkedIn" },
	]

	const navColumns = [
		{
			title: "Productos",
			links: [
				{ label: "Lattiz", href: "https://lattiz.app" },
			],
		},
		{
			title: "Recursos",
			links: [
				{ label: "Blog", href: "https://blog.lattiz.com" },
				{ label: "Documentación", href: "https://docs.lattiz.com" },
				{ label: "Soporte", href: "https://support.lattiz.com" },
			],
		},
		{
			title: "Compañía",
			links: [
				{ label: "Acerca de", href: "https://lattiz.com/about" },
				{ label: "Carreras", href: "https://lattiz.com/careers" },
				{ label: "Contacto", href: "https://lattiz.com/contact" },
			],
		},
		{
			title: "Legal",
			links: [
				{ label: "Política de privacidad", href: "https://lattiz.com/privacy" },
				{ label: "Términos de servicio", href: "https://lattiz.com/terms" },
			],
		},
	]

	const legalLinks = [
		{ label: "Política de privacidad", href: "https://lattiz.com/privacy" },
		{ label: "Términos de servicio", href: "https://lattiz.com/terms" },
	]

	const year = new Date().getFullYear();

	const getIcon = (idx: number) => {
		switch (idx) {
			case 0:
				return InstagramIcon;
			case 1:
				return LinkedInIcon;
			default:
				return null;
		}
	}

	return (
		<footer className="text-[#FFF] bg-black relative w-full pt-20 pb-22 z-10 overflow-x-hidden">
			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* Top grid */}
				<div className="grid grid-cols-2 gap-8 md:grid-cols-5 mb-16">
					{/* Brand column */}
					<div className="col-span-2 md:col-span-2 lg:col-span-1">
						<a
							href="/"
							className="mb-6 flex items-center gap-3 group w-fit"
						>
							<img
								src="/lattiz_logo_white.svg"
								alt=""
								aria-hidden="true"
								width={36}
								height={36}
								className="group-hover:opacity-80 transition-opacity"
							/>
							<span className="font-semibold text-lg text-white">Lattiz</span>
						</a>

						<p className="text-white/60 text-sm leading-relaxed max-w-xs mb-6">
							Sitios web profesionales en segundos. Sin programadores. Sin diseñadores. Sin complicaciones.
						</p>

						<div className="flex gap-3">
							{socials.map(({ key, href, label }, idx) => {
								const Icon = getIcon(idx);
								return (
									<a
										key={key}
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={label}
										className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:border-white/30 hover:text-white transition-colors"
									>
										{Icon && <Icon className="h-5 w-5" />}
									</a>
								);
							})}
						</div>
					</div>

					{/* Nav columns */}
					{navColumns.map((column) => (
						<nav key={column.title} aria-label={column.title}>
							<h3 className="mb-4 text-sm font-semibold text-white uppercase tracking-wider">
								{column.title}
							</h3>
							<ul className="space-y-3">
								{column.links.map(({ label, href }: { label: string, href: string }) => (
									<li key={label}>
										<a
											href={href}
											className="text-white/60 hover:text-white text-sm transition-colors"
										>
											{label}
										</a>
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>

				{/* Bottom bar */}
				<div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
					<p className="text-white/40 text-sm">
						{year} © Lattiz. Todos los derechos reservados.
					</p>
					<div className="flex flex-wrap justify-center gap-6">
						{legalLinks.map((link) => (
							<a
								key={link.label}
								href={link.href}
								className="text-white/40 hover:text-white/70 text-sm transition-colors"
							>
								{link.label}
							</a>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
