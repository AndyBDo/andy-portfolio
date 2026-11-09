# Andy Do — Portfolio Edition

Live site: https://andybdo.com. Private visitor analytics, owner sign-in, database setup, and deployment instructions: [ADMIN_SETUP.md](ADMIN_SETUP.md).

Run `npm install` and `npm run dev`. Production: `npm run build` (output: `dist`). Tests: `npm test` (uses installed Google Chrome).

The supplied directory was empty. This is a new Vite/vanilla JavaScript site with Three.js for a genuinely rotating original voxel landscape.

- `src/data.js`: résumé-backed experience, projects, and skills.
- `src/main.js`: menu, hash navigation, detail screens, advancements, print résumé, keyboard controls, and opt-in sound.
- `src/cornell.js`: actual Minecraft block materials, campus terrain, landscaping, sunlight, shadows and camera orbit, with reduced-motion support.
- `src/campus-buildings.js`: individually composed landmark models and surrounding academic buildings, reconstructed from the tour and campus layout.
- `src/voxel-model.js`: joins each building's intersecting solids into an exterior mesh; hidden and overlapping faces are removed before rendering.
- `src/campus-sky.js`: soft procedural clouds and blue atmospheric sky inspired by the recording.
- `src/style.css`: responsive game menu presentation and print layout.
- `src/assets/logo-portfolio.png`: transparent cleanup of the supplied Andy Do / Portfolio Edition logo.
- `tests/menu.spec.js`: navigation and responsive smoke test.

The Resume button opens `public/Andy_Do_Resume.pdf`. The site is deployed as the Cloudflare Worker `personal-website`, serving the Vite `dist` assets. The private admin dashboard uses a bound D1 database and server-verified Cloudflare Access sign-in.

Campus reconstruction: `src/cornell.js` uses the supplied CornellCraft screen recording and Google Maps satellite references around McGraw Tower (42.4476, -76.4845) and the Arts Quad (42.4487, -76.4841). Uris, Olin, Stimson, Old Stone Row, Goldwin Smith, Sage Chapel, Day Hall, Willard Straight, Barnes, the Cornell Store and Sage Hall have distinct footprints and silhouettes. Paths and sloping westward terrain follow the reference layout. Dimensions, some distant buildings, and tree placement are approximate; this is not a world-file import or a survey-accurate model of the entire campus.

Block textures in `public/minecraft/assets/minecraft/textures/block/` are extracted unchanged from the user's local Minecraft Java 1.21.4 JAR. The tower uses pale sandstone, Sage uses red masonry, Old Stone Row and Willard use gray stone, Olin uses light quartz, and roofs use gray concrete. Grass and foliage receive biome-style color tinting. Materials repeat per world block with nearest-neighbor magnification. The clock dial is custom pixel geometry artwork. Lighting uses warm directional sunlight, cached soft shadows, cool sky and bounce fill, filmic exposure and atmospheric fog. Shadowing and lighting approximate the recording's appearance; its Minecraft shader pack is not being run in the browser.

The reconstruction includes connected Uris wings, Olin's horizontal windows, Sage Chapel's red gables and rose window, Sage Hall's campanile and corner towers, Willard Straight's courtyard and battlements, distinct Old Stone Row buildings, and the Arts Quad's paths. It uses planted beds, trees with irregular canopies, flowers, grass, benches, lamps, road markings and foundations extending down the western slope. It remains a visual interpretation, not an exact copy of CornellCraft. `npm test` checks the exterior mesher, an actual rendered-campus pixel sample, camera motion, reduced motion and the menu flows.

The expanded outskirts are an approximate campus backdrop, with simplified neighborhood buildings, trees and street tiles extending beyond the named campus models. Sunset haze begins at 350 world units and reaches full opacity at 1050, keeping the central campus clear while softening the distant city. Outer terrain uses deep solid columns to prevent gaps on the western slope. Fine façade materials use directional shading and cast shadows onto terrain, with shadow reception disabled on their small ledges to prevent self-shadow shimmer. The background renders at display resolution and up to 30 frames per second; the HTML menu remains at native display resolution.

All interface text uses the locally served Minecraft font. WebGL is required for the panorama; the page remains usable with a solid fallback background. Build reports a bundle-size advisory for Three.js. Tour frame previews in `reference/` are local inspection artifacts. The original recording remains untouched on the Desktop.

Button refinement: classic 200×20 logical-pixel proportions at 2× scale, locally served MinecraftDefault-Regular font from https://github.com/tryashtar/minecraft-ttf/releases/tag/v1.6, and an original SVG stone-noise texture. Font glyphs originate from Minecraft; this remains an unofficial fan-inspired portfolio.
