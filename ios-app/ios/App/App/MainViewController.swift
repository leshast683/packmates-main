import UIKit
import Capacitor
import WebKit

// Explicitly forces the WKWebView autoplay policy rather than relying on
// Capacitor's own default WKWebViewConfiguration. Capacitor 8.4.2's
// documented default already sets mediaTypesRequiringUserActionForPlayback
// to [] (no gesture required) and allowsInlineMediaPlayback to true, but
// TestFlight testing showed muted/autoplay/playsinline videos were still
// rendering WebKit's native "tap to play" affordance on a real device -
// setting these explicitly here removes any doubt about whether that
// inherited default is actually in effect for this build.
class MainViewController: CAPBridgeViewController {
    override func webViewConfiguration(for instanceConfiguration: InstanceConfiguration) -> WKWebViewConfiguration {
        let configuration = super.webViewConfiguration(for: instanceConfiguration)
        configuration.allowsInlineMediaPlayback = true
        configuration.mediaTypesRequiringUserActionForPlayback = []
        return configuration
    }
}
