import AVFoundation
import AppKit
let asset = AVURLAsset(url: URL(fileURLWithPath: CommandLine.arguments[1]))
let generator = AVAssetImageGenerator(asset: asset)
generator.appliesPreferredTrackTransform = true
generator.maximumSize = CGSize(width: 1280, height: 800)
let seconds = CMTimeGetSeconds(asset.duration)
print("Duration: \(seconds)")
for (i, sample) in [0.0, 2, 4, 6, 8, 10, 12, 14, 16].enumerated() {
  let image = try generator.copyCGImage(at: CMTime(seconds: sample, preferredTimescale: 600), actualTime: nil)
  let bitmap = NSBitmapImageRep(cgImage: image)
  try bitmap.representation(using: .png, properties: [:])!.write(to: URL(fileURLWithPath: "reference/tour-\(i).png"))
}
