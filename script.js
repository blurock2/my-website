// ======================================== Discord server thing

const DISCORD_SERVER_ID = "1535974879554437210";
const GITHUB_USERNAME = "blurock2";

async function loadGithubProfile() {

    const profileAvatar = document.getElementById("github-avatar");
    const footerAvatar = document.getElementById("footer-avatar");
    const fallback = document.getElementById("github-avatar-fallback");

    if (!profileAvatar || !footerAvatar) {
        return;
    }

    try {

        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}`
        );

        if (!response.ok) {
            throw new Error("GitHub profile request failed.");
        }

        const profile = await response.json();

        profileAvatar.src = profile.avatar_url;
        footerAvatar.src = profile.avatar_url;
        profileAvatar.classList.add("is-visible");
        footerAvatar.classList.add("is-visible");

        if (fallback) {
            fallback.hidden = true;
        }

    } catch (error) {
        console.error("Failed to load GitHub profile:", error);
    }

}

// ======================================== Load the damn thing (discord widget)

async function loadDiscordWidget() {

    const container = document.getElementById("discord-members");

    if (!container) {
        return;
    }

    try {

        const response = await fetch(
            `https://discord.com/api/guilds/${DISCORD_SERVER_ID}/widget.json`
        );

        if (!response.ok) {
            throw new Error("Discord widget request failed.");
        }

        const server = await response.json();

        container.innerHTML = "";


        // ======================================== Show ze members!

        if (!server.members || server.members.length === 0) {

            container.innerHTML = `
                <p class="loading">
                    Nobody is currently visible.
                </p>
            `;

            return;
        }


        server.members.forEach(member => {

            const memberElement = document.createElement("div");

            memberElement.className = "discord-member";

            memberElement.innerHTML = `
                <img
                    class="discord-avatar"
                    src="${member.avatar_url}"
                    alt=""
                >

                <div>
                    <div class="discord-member-name">
                        ${escapeHtml(member.username)}
                    </div>

                    <div class="discord-member-status">
                        ${member.status}
                    </div>
                </div>
            `;

            container.appendChild(memberElement);

        });

    } catch (error) {

        console.error(
            "Failed to load Discord widget:",
            error
        );

        container.innerHTML = `
            <p class="loading">
                Discord server information is currently unavailable.
            </p>
        `;

    }

}


// ======================================== HTML escape!! ahh scary run run!

function escapeHtml(value) {

    const element = document.createElement("div");

    element.textContent = value;

    return element.innerHTML;

}


// ======================================== Todays year

function updateYear() {

    const yearElement =
        document.getElementById("current-year");

    if (!yearElement) {
        return;
    }

    yearElement.textContent =
        new Date().getFullYear();

}


// ======================================== Initialization of the site

document.addEventListener("DOMContentLoaded", () => {

    loadGithubProfile();
    loadDiscordWidget();

    updateYear();

});