/*
Copyright amir javanmir
Released on: June 25, 2025
*/
let player;
let availableQualities = [];
let mpdUrls = ['https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.mpd'];
let currentMpdIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
    initPlayer();

    document.getElementById('autoQuality').addEventListener('click', function () {
        setQuality("-1");
        updateButton("auto");
    })

    document.getElementById("lowQuality").addEventListener("click", function () {
        setQuality(getQualityByLevel("low"));
        updateButton("low");
    })

    document.getElementById("mediumQuality").addEventListener("click", function () {
        setQuality(getQualityByLevel("medium"));
        updateButton("medium");
    })

    document.getElementById("highQuality").addEventListener("click", function () {
        setQuality(getQualityByLevel("high"));
        updateButton("high");
    })

    document.getElementById('videoPlayer').addEventListener('fullscreenchange', function (e) {
        if (document.fullscreenElement) {
            const qualities = player.getBitrateInfoListFor('video');
            player.setQualityFor('video', qualities.length - 1);
        }
    });
})

function initPlayer() {
    const video = document.getElementById("videoPlayer");
    if (video && mpdUrls.length > 0) {
        const url = mpdUrls[currentMpdIndex];
        player = dashjs.MediaPlayer().create();

        player.getSettings().streaming.abr.autoSwitchBitrate.video = true;
        player.getSettings().streaming.abr.autoSwitchBitrate.audio = true;

        player.on(dashjs.MediaPlayer.events.PLAYBACK_METADATA_LOADED, onMetadataLoaded);
        player.on(dashjs.MediaPlayer.events.QUALITY_CHANGE_REQUESTED, onQualityChanged);
        player.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, onStreamInitialized);
        player.on(dashjs.MediaPlayer.events.ERROR, onError);

        player.initialize(video, url, true);
    }
}

function onMetadataLoaded(e) {
    updateQualityInfo();
}

function onQualityChanged(e) {
    updateQualityInfo();
}

function onStreamInitialized(e) {
    updateAvailableQualities();
    updateQualityInfo();
    updateButton("auto");
    setInterval(updateStats, 5000);
}

function onError(e) {
    console.error("Player error:", e);
    if (currentMpdIndex < mpdUrls.length - 1) {
        currentMpdIndex++;
        player.reset();

        let retryDelay = 1000 * Math.pow(2, currentMpdIndex);
        setTimeout(initPlayer, retryDelay);
    } else {
        document.getElementById("currentQuality").textContent = "Error loading";
        document.getElementById("qualityList").textContent = "Unable to access resources.";
    }
}

function setQuality(qualityIndex) {
    try {
        if (qualityIndex === -1) {
            player.updateSettings({
                streaming: {
                    abr: {
                        autoSwitchBitrate: {
                            video: true
                        }
                    }
                }
            });
        } else {
            player.updateSettings({
                streaming: {
                    abr: {
                        autoSwitchBitrate: {
                            video: false
                        }
                    }
                }
            });
            player.setQualityFor('video', qualityIndex);
        }
    } catch (error) {
        console.error('Error setting quality:', error);
    }
}

function updateQualityInfo() {
    try {
        const currentVideoQuality = player.getQualityFor("video");
        const videoQualities = player.getBitrateInfoListFor("video");
        if (videoQualities && videoQualities[currentVideoQuality]) {
            const quality = videoQualities[currentVideoQuality];
            const resolution = quality.width && quality.height ? `${quality.width} X ${quality.height}` : "Unknown";
            const bitrate = Math.round(quality.bitrate / 1000);
            document.getElementById("currentQuality").textContent = `Resolution: ${resolution}-(${bitrate}kbps)`;
        } else {
            document.getElementById("currentQuality").textContent = "Loading...";
        }
    } catch (error) {
        console.error('Error updating quality info:', error);
    }
}

function getQualityByLevel(level) {
    if (!availableQualities || availableQualities.length === 0) return 0;

    if (level == "low") {
        return 0;
    } else if (level == "medium") {
        return Math.floor(availableQualities.length / 2);
    } else if (level == "high") {
        return availableQualities.length - 1;
    }
    return 0;
}

function updateAvailableQualities() {
    try {
        const videoQualities = player.getBitrateInfoListFor('video');
        availableQualities = videoQualities;
        const qualityTexts = availableQualities.map(item => {
            const resolution = (item.width && item.height) ? `${item.width}X${item.height}` : "Unknown";
            const bitrate = Math.floor(item.bitrate / 1000);
            return `${resolution} (${bitrate}kbps)`;
        })
        document.getElementById("qualityList").textContent = qualityTexts.join(', ');
    } catch (error) {
        console.error('Error getting qualities:', error);
    }
}

function updateStats() {
    try {
        const isAutoSwitch = player.getSettings().streaming.abr.autoSwitchBitrate.video;
        document.getElementById("networkStatus").textContent = isAutoSwitch ? "Automatic" : "Manual";

        updateQualityInfo();

    } catch (error) {
        console.error('Error updating stats:', error);
        document.getElementById("networkStatus").textContent = "Unknown";
    }
}

function updateButton(status) {
    const buttons = document.querySelector("#qualityButtons");
    const child = Array.from(buttons.children);
    child.forEach(item => {
        item.removeAttribute("class");
        const statusButtons = item.getAttribute("data-res");
        if (status == statusButtons) {
            item.classList.add("active");            
        }
    })
}