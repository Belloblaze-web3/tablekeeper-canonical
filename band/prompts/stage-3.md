# Stage 3 dispatch — timezone edges and polish

@Architect Review the existing Tablekeeper service for timezone and daylight-saving edge cases, then improve the user experience around local restaurant hours, unavailable slots, confirmation, and cancellation. Keep the data contract coherent between the API and UI. Ask @Builder to implement the smallest safe changes and @Verifier to challenge boundary dates and party sizes.

Done state: slot semantics are interpreted in the restaurant's named timezone, unavailable slots are explained, and the responsive UI is presentation-ready.
