# regurlator

A RegExp URL Redirector:

  * it allows one or more *RegExp* to match any website and automatically (if desired) redirect to the destination *URL*
  * it allows you to **save** or **restore** list of *rules* to apply
  * *no match? no problem!* - it does literally nothing else if rules did not apply

by [@WebReflection](https://x.com/WebReflection)

![regurlator popup example](./regurlator.png)

## Handy Redirects

| Service     | RegExp | URL |
| :---------- | :----: | :-: |
| **Zoom**    | `^https:\/\/(?:\S+?)\.(zoom\.us)\/j\/(\d+)\?pwd=(.+)?$` | `https://app.$1/wc/join/$2?fromPWA=1&pwd=$3` |
| **BlueJeans** | `^(https?:\/\/(?:.*\.)?bluejeans\.com\/)(\d+(?:\/\d+)*)([?#][\S\s]*)?$` | `$1$2/webrtc$3` |
