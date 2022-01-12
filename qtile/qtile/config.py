# imports
import os, subprocess
from typing import List
from libqtile import bar, layout, widget, extension, hook
from libqtile.config import Click, Drag, Group, Key, Match, Screen
from libqtile.lazy import lazy

mod = "mod4"
terminal = "kitty"

colors = ["#282a36", "#44475a", "#f8f8f2", "#6272a4", "#8be9fd", "#50fa7b", "#ffb86c", "#ff79c6", "#bd93f9", "#ff5555", "#f1fa8c"]


## keys  

keys = [
    # Switch between windows
    Key([mod], "h", lazy.layout.left(), desc="Move focus to left"),
    Key([mod], "l", lazy.layout.right(), desc="Move focus to right"),
    Key([mod], "j", lazy.layout.down(), desc="Move focus down"),
    Key([mod], "k", lazy.layout.up(), desc="Move focus up"),
    Key([mod], "space", lazy.layout.next(),
        desc="Move window focus to other window"),

    # Move windows between left/right columns or move up/down in current stack.
    # Moving out of range in Columns layout will create new column.
    Key([mod, "shift"], "h", lazy.layout.shuffle_left(),
        desc="Move window to the left"),
    Key([mod, "shift"], "l", lazy.layout.shuffle_right(),
        desc="Move window to the right"),
    Key([mod, "shift"], "j", lazy.layout.shuffle_down(),
        desc="Move window down"),
    Key([mod, "shift"], "k", lazy.layout.shuffle_up(), desc="Move window up"),

    # Grow windows. If current window is on the edge of screen and direction
    # will be to screen edge - window would shrink.
    Key([mod, "control"], "h", lazy.layout.grow_left(),
        desc="Grow window to the left"),
    Key([mod, "control"], "l", lazy.layout.grow_right(),
        desc="Grow window to the right"),
    Key([mod, "control"], "j", lazy.layout.grow_down(),
        desc="Grow window down"),
    Key([mod, "control"], "k", lazy.layout.grow_up(), desc="Grow window up"),
    Key([mod], "n", lazy.layout.normalize(), desc="Reset all window sizes"),

    # Toggle between split and unsplit sides of stack.
    # Split = all windows displayed
    # Unsplit = 1 window displayed, like Max layout, but still with
    # multiple stack panes
    Key([mod, "shift"], "Return", lazy.layout.toggle_split(),
        desc="Toggle between split and unsplit sides of stack"),
    Key([mod], "Return", lazy.spawn(terminal), desc="Launch terminal"),

    # Toggle between different layouts as defined below
    Key([mod], "space", lazy.next_layout(), desc="Toggle between layouts"),
    Key([mod], "w", lazy.window.kill(), desc="Kill focused window"),

    Key([mod, "control"], "r", lazy.restart(), desc="Restart Qtile"),
    Key([mod, "control"], "q", lazy.shutdown(), desc="Shutdown Qtile"),
    Key([mod], "r", lazy.spawncmd(),
        desc="Spawn a command using a prompt widget"),
    
    # dmenu
    Key([mod], "p", lazy.spawn("dmenu_run")),

    # firefox
    Key([mod],"b", lazy.spawn("firefox")),

    # betterlockscreen
    Key([mod], "x", lazy.spawn("betterlockscreen -l")),

    # File Manager
    Key([mod], "f", lazy.spawn("thunar")),

    # Brightness Control
    Key([], "XF86MonBrightnessUp", lazy.spawn("brightnessctl set +5%")),
    Key([], "XF86MonBrightnessDown", lazy.spawn("brightnessctl set 5%-")),
    
    # Volume Control
    Key([], "XF86AudioRaiseVolume", lazy.spawn("amixer -q -D pulse set Master 5%+ unmute")),
    Key([], "XF86AudioLowerVolume", lazy.spawn("amixer -q -D pulse set Master 5%- unmute")),
    Key([], "XF86AudioMute", lazy.spawn("amixer -q -D pulse set Master toggle")),
    
    # Mic Control
    Key([], "XF86AudioMicMute", lazy.spawn("amixer -q -D pulse set Capture toggle")),
]





## groups
groups = [
    Group("1", label="", matches=[Match(wm_class=["kitty"])]),
    Group("2", label="", matches=[Match(wm_class=["firefox"])],layout="max"),
    Group("3", label="", matches=[Match(wm_class=["Code"])]),
    Group("4", label="", matches=[Match(wm_class=["vlc","Spotify"])]),
    Group("5", label="", matches=[Match(wm_class=["VirtualBox Manager"])]),
    #Group("6", label="othr", matches=[Match(wm_class=[])]),
]

for i in groups:
    keys.extend([
        # mod1 + letter of group = switch to group
        Key([mod], i.name, lazy.group[i.name].toscreen(),
            desc="Switch to group {}".format(i.name)),

        # mod1 + shift + letter of group = switch to & move focused window to group
        Key([mod, "shift"], i.name, lazy.window.togroup(i.name, switch_group=True),
            desc="Switch to & move focused window to group {}".format(i.name)),

        Key([mod], "Tab", lazy.screen.next_group()),
        Key([mod, "shift"], "Tab", lazy.screen.prev_group()),
        # Or, use below if you prefer not to switch to that group.
        # # mod1 + shift + letter of group = move focused window to group
        # Key([mod, "shift"], i.name, lazy.window.togroup(i.name),
        #     desc="move focused window to group {}".format(i.name)),
    ])




## layouts
layouts = [
    layout.Columns(
        border_focus = colors[7],
        border_normal = '#0a1529',
        border_width=2,
        margin=[0,3,5,3],
    ),
    layout.Max(),
    # Try more layouts by unleashing below layouts.
    # layout.Stack(num_stacks=2),
    # layout.Bsp(),
    # layout.Matrix(),
    # layout.MonadTall(),
    # layout.MonadWide(),
    # layout.RatioTile(),
    # layout.Tile(),
    # layout.TreeTab(),
    # layout.VerticalTile(),
    # layout.Zoomy(),
]

widget_defaults = dict(
    font='DejaVu Sans',
    fontsize=16,
    padding=3,
)
extension_defaults = widget_defaults.copy()

screens = [
    Screen(
        top=bar.Bar(
            [
                widget.GroupBox(
                    highlight_method='line', borderwidth=3, highlight_color=colors[0], spacing=6,
					other_current_screen_border=colors[7], this_current_screen_border=colors[7],
                    block_highlight_text_color=colors[7], active=colors[7], inactive=colors[8],
                    disable_drag=True, fontsize=16,
                ),
                widget.Spacer(length=5),
                widget.TextBox("|",foreground="#999999"),
                widget.Spacer(length=20),
                widget.CurrentLayoutIcon(scale=0.5),
                widget.Prompt(),
                widget.WindowName(fontsize=13, foreground=colors[7]),
                #widget.Net(format='{down} {up}', foreground=colors[4]),
                
		widget.TextBox("[",foreground=colors[5]),
		widget.TextBox("", foreground=colors[5]),# volume icon
                widget.Volume(foreground=colors[5]),
		widget.TextBox("]",foreground=colors[5]),
		widget.Spacer(length=10),
                
		widget.TextBox("[",foreground=colors[6]),
		widget.CPU(format=' {load_percent}%', foreground=colors[6]),
		widget.TextBox("]",foreground=colors[6]),
		widget.Spacer(length=10),
                
		widget.TextBox("[",foreground=colors[7]),
		widget.Memory(format=' {MemPercent}%', foreground=colors[7]),
		widget.TextBox("]",foreground=colors[7]),
		widget.Spacer(length=10),
                
		widget.TextBox("[",foreground=colors[8]),
		widget.Battery(format=' {percent:2.0%}', foreground=colors[8]),
		widget.TextBox("]",foreground=colors[8]),
		widget.Spacer(length=10),
                
		widget.TextBox("[",foreground=colors[9]),
		widget.TextBox("", foreground=colors[9]),# clock icon
                widget.Clock(format='%d-%b %I:%M %p', foreground=colors[9]),
		widget.TextBox("]",foreground=colors[9]),
		widget.Spacer(length=10),
                widget.Notify(background=colors[0]),
		widget.Systray(),
            ],
            34,
            margin=[0, 0, 4, 0],
            background=colors[0],
        ),
        wallpaper="/home/athul/Pictures/Wallpapers/bg2.jpg",
        wallpaper_mode="fill"
    
    ),
    Screen(
        wallpaper="/home/athul/Pictures/Wallpapers/bg2.jpg",
        wallpaper_mode="fill"
    ),
]


@hook.subscribe.startup_once
def start_once():
    home = os.path.expanduser('~')
    subprocess.call([home + '/.config/qtile/autostart.sh'])


# Drag floating layouts.
mouse = [
    Drag([mod], "Button1", lazy.window.set_position_floating(),
         start=lazy.window.get_position()),
    Drag([mod], "Button3", lazy.window.set_size_floating(),
         start=lazy.window.get_size()),
    Click([mod], "Button2", lazy.window.bring_to_front())
]

dgroups_key_binder = None
dgroups_app_rules = []  # type: List
follow_mouse_focus = True
bring_front_click = False
cursor_warp = False
floating_layout = layout.Floating(float_rules=[
    # Run the utility of `xprop` to see the wm class and name of an X client.
    *layout.Floating.default_float_rules,
    Match(wm_class='confirmreset'),
    Match(wm_class='qBittorrent'),
    Match(wm_class='Thunar'),
    Match(wm_class='Signal'),
    Match(wm_class='Blueberry.py'),
    Match(wm_class='makebranch'),
    Match(wm_class='Lxappearance'),
    Match(wm_class='maketag'),
    Match(wm_class='ssh-askpass'),
    Match(title='branchdialog'),
    Match(title='pinentry'),
],border_focus=colors[7], border_normal = '#0a1529',border_width=2)
auto_fullscreen = True
focus_on_window_activation = "smart"
reconfigure_screens = True

# If things like steam games want to auto-minimize themselves when losing
# focus, should we respect this or not?
auto_minimize = True

wmname = "LG3D"
