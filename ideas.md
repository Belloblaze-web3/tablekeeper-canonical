# Tablekeeper design brief

## Chosen direction: Editorial neighborhood dining

Tablekeeper is a clean-room reservation product, not a literal OpenTable copy. Its visual language is a warm editorial directory: ink-black type, parchment surfaces, tomato red action color, and citrus yellow highlights. The interface should feel like a trusted city guide with the speed of a modern booking tool.

- **Movement:** contemporary editorial utility; oversized serif headlines paired with compact sans UI labels.
- **Principles:** one decisive action per card, visible availability, trust through concrete details, generous whitespace, and calm error states.
- **Color philosophy:** deep ink (#181817) anchors the UI; parchment (#f7f5ef) keeps the canvas warm; tomato (#e34b35) marks action and urgency; citrus (#f4c95d) highlights the promise of a night out; sage (#dfe8dc) signals confirmed state.
- **Layout:** a narrow editorial header, asymmetric hero/search band, then a two-column discovery grid that collapses gracefully on mobile.
- **Signature elements:** tomato oval logo mark, tiny uppercase metadata, “Tonight, made easy” promise, and availability pills that read like theatre tickets.
- **Interaction:** direct manipulation, no dead ends, reservations confirm only after the server responds, and conflicts explain the next best choice.
- **Animation:** restrained 180ms lift on cards and a soft shimmer for pending availability; no decorative motion that competes with booking.
- **Typography:** Fraunces for display headlines; Inter/system sans for controls, metadata, and body copy.
- **Brand essence:** confident, warm, precise.
- **Voice:** concise, hospitable, a little knowing — “Your table is waiting.”
- **Wordmark:** lowercase `tablekeeper`, with the tomato oval as the dot-like accent.
- **Signature color:** tomato red.

## Reference product

The product category reference is OpenTable-style restaurant discovery and reservations. Tablekeeper is a clean-room clone: it reproduces the user problem and booking flow, but uses its own data model, brand, copy, and interface.

## Asset plan

The interface is a functional reservation utility, so no stock or generated photography is required. Restaurant cards use carefully composed CSS color blocks and initials to stay offline-friendly and avoid unlicensed imagery. The required project icon is the tomato-oval mark created in `public/tablekeeper-logo.svg` and `public/tablekeeper-icon.svg`.
