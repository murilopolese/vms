# Coding with color

After reading [this tweet](https://twitter.com/PlusPlusInt/status/1299221041378734080) I ended up reading [this really cool article](https://www.microsoft.com/en-us/research/publication/tilecode-creation-of-video-games-on-gaming-handhelds/) and got inspired to do something that could be translated initially not for a sprite situation but for a LED matrix situation.

The idea is simple: A configurable cellular automata engine. A finite state machine programmed by describing a situation and an action to be taken when the situation happen.

It is still really hard (like in a Wireworld situation) to execute general computation tasks, but for games it's a quite good compromise. Some things are very easy to do, some a really hard, others are impossible (or just really hard, maybe?).

The difference between this and a regular cellular automata engine is that in my implementation you can assign rules for events:

- Tick: Will run every game tick
- Up, Left, Right, Down, A and B: Will run only on the respective keyboard events

The game is a tile set and a bunch of rules. The engine can be ported as easily as the target has capability to compute a cellular automata.

Capable of run on PixelKit and other DIY LED matrix things. In addition, the implementation can bind parts of the tileset or rules to GPIO.
